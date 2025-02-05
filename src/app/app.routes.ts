import { Routes } from '@angular/router';
import { HomeComponent } from './component/pages/home/home.component';
import { LoginComponent } from './component/pages/login/login.component';
import { RegisterComponent } from './component/pages/register/register.component';
import { ProfileComponent } from './component/pages/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
 { path: '', component: LoginComponent },
 { path: 'register', component: RegisterComponent},
 { path: 'home', component: HomeComponent }, //canActivate: [AuthGuard]
 { path: 'profile', component: ProfileComponent } //canActivate: [AuthGuard]
 
 
];

