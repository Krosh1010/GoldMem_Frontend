import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { AuthModel } from '../../../models/LogModel/auth.model';
import { AuthenticationService } from '../../../services/ApiServices/authentication.services';

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

  constructor(private router: Router,  
    private fb: FormBuilder, 
    private authService: AuthenticationService ) {}
  
  private displayError(message: string): void {
    this.errorMessage = message;
    this.isErrorVisible = true;
    setTimeout(() => (this.isErrorVisible = false), 2000);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
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

    const formdata: AuthModel = {
      userName: this.loginForm.value.username.trim(),
      password: CryptoJS.SHA256(this.loginForm.value.password).toString(),
      data: undefined
    };

    try {
      const response = await this.authService.login(formdata);
      const datas = response.data;
      if (datas && datas.token) {
        console.log('Autentificare reușită:', datas);
        localStorage.setItem('authToken', JSON.stringify({token: datas.token}));
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
