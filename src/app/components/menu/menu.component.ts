import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { LoginComponent } from '../login/login.component';
import { MenuVisibilityService } from 'src/app/services/menu-visibility.service';
import { ResourceService } from 'src/app/services/resource.service';
import { HttpClient, HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    IonicModule,
    SharedModule,
    HttpClientModule,
  ],
  providers:[LoginComponent]
})
export class MenuComponent implements OnInit {

  logout_uri = environment.logout_url;
  isLogged: boolean;
  isAdmin: boolean;

  menuVisibility:boolean;

  constructor(private router: Router, private login:LoginComponent, private menuVisibilityService: MenuVisibilityService, private resourceService:ResourceService, private http: HttpClient) { }

  ngOnInit(): void {

    this.menuVisibilityService.menuVisibility$.subscribe(visibility => {
      this.menuVisibility = visibility;
    });
    this.getLogged();
    this.getAdmin();
  }

  // onLogout(): void {
  //   location.href = this.logout_uri;
  // }

  onLogout(){
    this.resourceService.clearUserRoleToStorage();
    this.resourceService.clearServiceIdToStorage();
    window.location.href = 'http://127.0.0.1:9000/logout';
  }

  onLogin(){
    this.router.navigate(['login']);
  }

  getLogged(){
    this.resourceService.logged().subscribe(data =>{
      if(data.message != null){
        this.isLogged=true;
      }
    },
    err=>{
      console.error(err);
    })
  }

  getAdmin(){
    this.resourceService.logged().subscribe(data =>{
      if(data.message.includes('ADMIN')){
        this.isAdmin=true;
      }
    })
  }
}
