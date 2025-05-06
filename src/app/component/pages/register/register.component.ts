import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../services/ApiServices/authentication.services';
import * as CryptoJS from 'crypto-js';
import { passwordMatchValidator } from '../../../validators/password.validator';
import { RegisterModel } from '../../../models/LogModel/register.model';
import { SharedDirectivesModule } from '../../../directives/shared-directives.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedDirectivesModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage: string = '';
  isErrorVisible: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthenticationService, private fb: FormBuilder) {}

  private displayError(message: string): void {
    this.errorMessage = message;
    this.isErrorVisible = true;
    setTimeout(() => (this.isErrorVisible = false), 2000);
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator() });
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.displayError('All fields are required!');
      return;
    }

    this.isLoading = true;
    const formdata: RegisterModel = {
      email: this.registerForm.value.email.trim(),
      userName: this.registerForm.value.username.trim(),
      password: CryptoJS.SHA256(this.registerForm.value.password).toString(),
      data: undefined
    };

    try {
      const response = await this.authService.register(formdata);
      const datas = response.data;
      if (datas && datas.token) {
        console.log('Registrare reușită:', datas);
        localStorage.setItem('authToken', JSON.stringify({token: datas.token}));
        this.router.navigate(['/']);
      } else {
        throw new Error('Tokenul nu a fost returnat de server.');
      }
    } catch (error: any) {
      console.error('Eroare la înregistrare:', error);
      this.displayError(error?.message || 'Registration failed. Check the data entered!');
    } finally {
      this.isLoading = false;
    }
  }
}
