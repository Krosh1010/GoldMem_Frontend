import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import * as CryptoJS from 'crypto-js';
import { UserAuth } from '../../../models/user-auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: UserAuth = { email: '', password: '' };
  showPassword: boolean = false;
  errorMessage: string = '';
  isErrorVisible: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router, private apiService: ApiService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (!form.valid) {
      this.errorMessage = 'Toate câmpurile sunt obligatorii!';
      this.isErrorVisible = true;
      setTimeout(() => (this.isErrorVisible = false), 2000);
      return;
    }

    this.isLoading = true;

    const hashedPassword = CryptoJS.SHA256(this.user.password).toString();

    try {
      const response = await this.apiService.postData('/auth/login', {
        email: this.user.email.trim(),
        password: hashedPassword
      });

      if (response && response.token) {
        console.log('Autentificare reușită:', response);
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['']);
      } else {
        throw new Error('Tokenul nu a fost returnat de server.');
      }
    } catch (error: any) {
      console.error('Eroare la autentificare:', error);
      this.errorMessage = error?.message || 'Autentificare eșuată. Verificați datele introduse!';
      setTimeout(() => {
        this.isErrorVisible = false;
      }, 2000);
    } finally {
      this.isLoading = false;
    }
    this.isErrorVisible = true;
  }

  navigateToRegister(path: string): void {
    this.router.navigate([path]);
  }
}
