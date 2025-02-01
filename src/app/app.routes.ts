import { Routes } from '@angular/router';
import { HomeComponent } from './component/pages/home/home.component';
import { LoginComponent } from './component/pages/login/login.component';
import { RegisterComponent } from './component/pages/register/register.component';


export const routes: Routes = [
 { path: '', component: LoginComponent },
 { path: 'register', component: RegisterComponent},
 { path: 'home', component: HomeComponent}
 
 
];

