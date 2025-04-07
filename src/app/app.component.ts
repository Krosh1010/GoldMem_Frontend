import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from "./component/layout/header/header.component";
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showHeader: boolean = true; 

  constructor(private router: Router,private themeService: ThemeService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd)) 
      .subscribe((event: NavigationEnd) => {
        this.themeService.applyTheme(); 
        const noHeaderRoutes = ['/', '/register']; 
        this.showHeader = !noHeaderRoutes.includes(event.urlAfterRedirects); 
      });
  }
  
}
