import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';
import { RouterModule } from '@angular/router';
import { filter,Subscription } from 'rxjs';
import { ChatOverlayService } from '../../../services/ChatServices/chat-overlay.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDarkTheme = false;
  themeIcon = '☀️';
  showThemeToggle = false;
  showProfileButton = true;
  showChatDropdown = false;
  private subs: Subscription[] = [];
  allChatsWithMessages: string[] = [];


  constructor(private router: Router,
    private route: ActivatedRoute, 
    private themeService: ThemeService,
    public chatOverlay: ChatOverlayService
  ){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Determină pe ce pagină suntem
      const currentRoute = this.getCurrentRoute(this.route);
      
      // Setează vizibilitatea butoanelor
      this.showThemeToggle = currentRoute.snapshot.data['showThemeToggle'] || false;
      this.showProfileButton = currentRoute.snapshot.data['showProfileButton'] || false;
      
      // Actualizează iconița temei
      this.updateThemeIcon();
    });
  }
  private getCurrentRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
  // 1️⃣ Setează tema curentă
  this.isDarkTheme = this.themeService.currentTheme === 'dark';
  this.updateThemeIcon();

  // 2️⃣ Funcție helper pentru a construi lista tuturor chat-urilor cu mesaje
  const updateChats = () => {
    // combină deschise + minimizate
    const allUsers = Array.from(new Set([
      ...(this.chatOverlay.openUsers$.value || []),
      ...(this.chatOverlay.minimizedUsers$.value || [])
    ]));

    // filtrează doar chat-urile care au mesaje
    this.allChatsWithMessages = allUsers.filter(u => {
      const msgs = this.chatOverlay.getMessages(u);
      return msgs && msgs.length > 0;
    });
  };

  // 3️⃣ Subscribe la openUsers$ pentru update dinamic
  this.subs.push(
    this.chatOverlay.openUsers$.subscribe(() => updateChats())
  );

  this.subs.push(
    this.chatOverlay.minimizedUsers$.subscribe(() => updateChats())
  );

  updateChats();
}


  ngOnDestroy(): void {
  this.subs.forEach(s => s.unsubscribe());
}


  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDarkTheme = this.themeService.currentTheme === 'dark';
    this.updateThemeIcon();
  }

  private updateThemeIcon(): void {
    this.themeIcon = this.isDarkTheme ? '🌙' : '☀️';
  }
  toggleChatDropdown(): void {
  this.showChatDropdown = !this.showChatDropdown;
}

// Restaurare chat selectat
restoreChat(user: string) {
  const session = this.chatOverlay['sessions'].get(user);
  if (!session) return;

  this.chatOverlay.restore(user);
  this.showChatDropdown = false;
}


}