import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import * as CryptoJS from 'crypto-js';
import { UserAuth } from '../../../models/user-auth';
import { passwordMatchValidator } from '../../../validators/password.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  user: UserAuth = { email: '', password: '' };
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage: string = '';
  isErrorVisible: boolean = true;
  isLoading: boolean = false;

  constructor(private router: Router, private apiService: ApiService) {}

  togglePasswordVisibility(input: 'password' | 'confirm'): void {
    if (input === 'password') {
      this.showPassword = !this.showPassword;
    } else if (input === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (!form.valid) {
      this.errorMessage = 'Toate câmpurile sunt obligatorii!';
      this.isErrorVisible = true;
      setTimeout(() => {
        this.isErrorVisible = false;
      }, 2000);
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Parolele nu coincid!';
      this.isErrorVisible = true;
      return;
    }

    this.isLoading = true;

    const hashedPassword = CryptoJS.SHA256(this.user.password).toString();

    try {
      const response = await this.apiService.postData('/auth/register', {
        email: this.user.email.trim(),
        password: hashedPassword
      });

      if (response && response.token) {
        console.log('Registrare reușită:', response);
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['']);
      } else {
        throw new Error('Tokenul nu a fost returnat de server.');
      }
    } catch (error: any) {
      console.error('Eroare la înregistrare:', error); 
      this.errorMessage = error?.message || 'Înregistrare eșuată. Verificați datele introduse!';
      setTimeout(() => {
        this.isErrorVisible = false;
      }, 2000);
    } finally {
      this.isLoading = false;
    }
    this.isErrorVisible = true;
  }
}
