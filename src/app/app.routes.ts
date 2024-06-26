import { AuthorizedComponent } from './components/authorized/authorized.component';
import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { AdminComponent } from './components/admin/admin.component';
import { LogoutComponent } from './components/logout/logout.component';
import { LoginComponent } from './components/login/login.component';
import { IsAdminGuard } from './pages/admin-dashboard/guard/is-admin.guard';

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
  { path: 'user', component: UserComponent , },
  { path: 'admin', component: AdminComponent, canActivate: [IsAdminGuard]},
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.page').then( m => m.AdminDashboardPage),
    canActivate: [IsAdminGuard]
  },
  { path: 'logout', component: LogoutComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin/user-profile',
    loadComponent: () => import('./pages/user-profile/user-profile.page').then( m => m.UserProfilePage)
  },
  {
    path: 'admin/services/:id',
    loadComponent: () => import('./pages/services-view/services-view.page').then( m => m.ServicesViewPage)
  },
  
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
