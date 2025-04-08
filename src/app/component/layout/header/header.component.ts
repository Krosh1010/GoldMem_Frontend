import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDarkTheme = false;
  themeIcon = '☀️';
  showThemeToggle = false;
  showProfileButton = true;
  constructor(private router: Router,private route: ActivatedRoute, private themeService: ThemeService){
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
    this.isDarkTheme = this.themeService.currentTheme === 'dark';
    this.updateThemeIcon();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDarkTheme = this.themeService.currentTheme === 'dark';
    this.updateThemeIcon();
  }

  private updateThemeIcon(): void {
    this.themeIcon = this.isDarkTheme ? '🌙' : '☀️';
  }
}