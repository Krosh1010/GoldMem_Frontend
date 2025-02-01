import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';
  isErrorVisible: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router, private apiService: ApiService, private fb: FormBuilder) {}
  
  private displayError(message: string): void {
    this.errorMessage = message;
    this.isErrorVisible = true;
    setTimeout(() => (this.isErrorVisible = false), 2000);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.displayError('All fields are required!');
      return;
    }

    this.isLoading = true;

    const formdata = this.loginForm.value;
    const hashedPassword = CryptoJS.SHA256(formdata.password).toString();

    try {
      const response = await this.apiService.postData('/auth/login', {
        email: formdata.email.trim(),
        password: hashedPassword
      });

      if (response && response.token) {
        console.log('Autentificare reușită:', response);
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/home']);
      } else {
        throw new Error('Tokenul nu a fost returnat de server.');
      }
    } catch (error: any) {
      console.error('Eroare la autentificare:', error);
      this.displayError(error?.message || 'Registration failed. Check the data entered!'); 
    } finally {
      this.isLoading = false;
    }
  }

  navigateToRegister(path: string): void {
    this.router.navigate([path]);
  }
}
