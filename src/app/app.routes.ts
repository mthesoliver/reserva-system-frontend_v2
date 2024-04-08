import { AuthorizedComponent } from './components/authorized/authorized.component';
import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { AdminComponent } from './components/admin/admin.component';
import { LogoutComponent } from './components/logout/logout.component';
import { LoginComponent } from './components/login/login.component';
import { IsAdminGuard } from './pages/admin-dashboard/guard/is-admin.guard';

export const routes: Routes = [
  { 
  path: 'home', title: "Home",
  loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'register', title: "Registrar-se",
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  { path: 'authorized', component: AuthorizedComponent },
  { path: 'user', component: UserComponent , },
  { path: 'admin', component: AdminComponent, canActivate: [IsAdminGuard],},
  {
    path: 'admin/dashboard', title: "Dashboard",
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.page').then( m => m.AdminDashboardPage),
    canActivate: [IsAdminGuard],
  },
  { path: 'logout', title: "Login", component: LogoutComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin/user-profile', title: "Perfil",
    loadComponent: () => import('./pages/user-profile/user-profile.page').then( m => m.UserProfilePage),
    canActivate: [IsAdminGuard],
  },
  {
    path: 'admin/services/:id', title: "Serviço",
    loadComponent: () => import('./pages/services-view/services-view.page').then( m => m.ServicesViewPage),
    canActivate: [IsAdminGuard],
  },
  {
    path: 'admin/reservas' , title: "Reservas",
    loadComponent: () => import('./pages/reservas/reservas.page').then( m => m.ReservasPage),
    canActivate: [IsAdminGuard],
  },
  {
    path: 'admin/services/details/:id', title: "Detalhes do Serviço",
    loadComponent: () => import('./pages/service-details/service-details.page').then( m => m.ServiceDetailsPage),
    canActivate: [IsAdminGuard],
  },
  {
    path: 'page/:name',
    loadComponent: () => import('./pages/public-profile/public-profile.page').then( m => m.PublicProfilePage),
  },
  {
    path: 'page/:name/:serviceId',
    loadComponent: () => import('./pages/public-profile/child/service-calendar/service-calendar.page').then( m => m.ServiceCalendarPage)
  },
  
  { path: '**', redirectTo: 'home', pathMatch: 'full' },

];
