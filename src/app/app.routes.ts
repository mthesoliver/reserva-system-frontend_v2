import { AuthorizedComponent } from './components/authorized/authorized.component';
import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { AdminComponent } from './components/admin/admin.component';
import { LogoutComponent } from './components/logout/logout.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { 
  path: 'home', 
  loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  { path: 'authorized', component: AuthorizedComponent },
  { path: 'user', component: UserComponent , 
},
  { path: 'admin', component: AdminComponent, 
},
  { path: 'logout', component: LogoutComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
