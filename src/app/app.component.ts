import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { HeaderComponent } from "./component/layout/header/header.component";
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { LoadingComponent } from './component/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
// app.component.ts
export class AppComponent {
  showHeader: boolean = true;
  loading: boolean = false; 

  constructor(private router: Router, private themeService: ThemeService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Show loading only on page refresh/reload
        if (event.navigationTrigger === 'popstate' || !this.router.navigated) {
          this.loading = true;
        }
      }

      if (event instanceof NavigationEnd || 
          event instanceof NavigationCancel || 
          event instanceof NavigationError) {
        if (event instanceof NavigationEnd) {
          this.themeService.applyTheme();
          const noHeaderRoutes = ['/', '/register'];
          this.showHeader = !noHeaderRoutes.includes(event.urlAfterRedirects.split('?')[0]);
        }
        
        setTimeout(() => {
          this.loading = false;
        }, 2500);
      }
    });
  }
}
