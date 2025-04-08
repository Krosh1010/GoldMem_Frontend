import { Routes } from '@angular/router';
import { HomeComponent } from './component/pages/home/home.component';
import { LoginComponent } from './component/pages/login/login.component';
import { RegisterComponent } from './component/pages/register/register.component';
import { ProfileComponent } from './component/pages/profile/profile.component';
import { ProfilesetingComponent } from './component/pages/profileseting/profileseting.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
 { path: '', component: LoginComponent },
 { path: 'register', component: RegisterComponent},
 { path: 'seting', component: ProfilesetingComponent,
  data: { showThemeToggle: false, showProfileButton: true }
 },
 { path: 'home', component: HomeComponent,
    data: { showThemeToggle: false, showProfileButton: true }
  },//canActivate: [AuthGuard] 
 { path: 'profile', component: ProfileComponent,
    data: { showThemeToggle: true, showProfileButton: false }
  }//canActivate: [AuthGuard] 
 
];

