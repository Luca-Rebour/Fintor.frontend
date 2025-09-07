import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { SigninComponent } from './features/auth/signin/signin.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent },
    { path: 'home', component: HomeComponent }
];
