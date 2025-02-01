import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import * as CryptoJS from 'crypto-js';
import { passwordMatchValidator } from '../../../validators/password.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage: string = '';
  isErrorVisible: boolean = true;
  isLoading: boolean = false;

  constructor(private router: Router, private apiService: ApiService, private fb:FormBuilder) {}
  
  private displayError(message: string): void {
    this.errorMessage = message;
    this.isErrorVisible = true;
    setTimeout(() => (this.isErrorVisible = false), 2000);
  }
  
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator() });
  }
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await this.apiService.getData(`/auth/check-email?email=${email}`);
      return response.exists; // de schimbat endpointul
    } catch {
      return false;
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    this[field === 'password' ? 'showPassword' : 'showConfirmPassword'] =
      !this[field === 'password' ? 'showPassword' : 'showConfirmPassword'];
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.displayError('All fields are required!');
      return;
    }

    if (await this.checkEmailExists(this.registerForm.value.email)) {
      this.displayError('Acest email este deja înregistrat!');
      return;
    }

    this.isLoading = true;
    const formdata = this.registerForm.value;
    const hashedPassword = CryptoJS.SHA256(formdata.password).toString();

    try {
      const response = await this.apiService.postData('/auth/register', {
        email: formdata.email.trim(),
        password: hashedPassword,
      });

      if (response && response.token) {
        console.log('Registrare reușită:', response);
        localStorage.setItem('authToken', response.token);
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
