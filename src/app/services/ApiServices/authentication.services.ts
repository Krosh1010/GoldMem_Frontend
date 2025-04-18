import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthModel } from '../../models/auth.model';
import { RegisterModel } from '../../models/register.model';

@Injectable({
    providedIn: 'root',
})

export class AuthenticationService {
    constructor(private apiService: ApiService) {}

    async login(authData: AuthModel): Promise<AuthModel> {
        return this.apiService.postData('api/AuthControler/Login', authData);
    }

    async register(registerData: AuthModel): Promise<RegisterModel> {
        return this.apiService.postData('api/AuthControler/Register', registerData);
    }
}