
import { ResourceService } from 'src/app/services/resource.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
    
const app = document.getElementsByTagName('ion-app')

@Injectable({
  providedIn: 'any'
})

export class IsAdminGuard implements CanActivate {

  canAccessRoute:boolean;

  constructor(private router: Router){
  }
    
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if(localStorage.getItem('role') == "ADMIN"){
        this.canAccessRoute=true;
        return this.canAccessRoute
      }else{
          this.router.navigate(['login']), {queryParams: {returnUrl: state.url}};
          return false
        }
    }
  }
