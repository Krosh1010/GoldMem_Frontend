import { Injectable, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDark = false;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme');
      this.isDark = saved === 'dark';
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      this.applyTheme();
    }
  }

  get currentTheme() {
    return this.isDark ? 'dark' : 'light';
  }

  applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const body = document.body;
      body.classList.remove('dark-theme', 'light-theme');
      body.classList.add(this.isDark ? 'dark-theme' : 'light-theme');
    }
  }
}
