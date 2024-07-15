import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { LoginComponent } from '../login/login.component';
import { MenuVisibilityService } from 'src/app/services/menu-visibility.service';
import { ResourceService } from 'src/app/services/resource.service';
import { HttpClientModule} from '@angular/common/http';
import { CriptoService } from 'src/app/services/cripto.service';

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
  isLogged:boolean;
  isAdmin:boolean;
  isMobile:boolean;

  menuVisibility:boolean;
  @Input()
  avatar:string='';

  constructor(private criptoService:CriptoService, private router: Router, private menuVisibilityService: MenuVisibilityService, private resourceService:ResourceService) { }
  
  ngOnInit(): void {
    this.menuVisibilityService.menuVisibility$.subscribe(visibility => {
      this.menuVisibility = visibility;
    });
    this.getLogged();

    if(this.avatar=''){
      this.avatar = this.criptoService.getEncryptItem('userProfilePicture');
    }
    this.verifyIsMobile()
  }

  verifyIsMobile(){
    if(window.innerWidth <= 768){
      this.isMobile=true
    }else{
      this.isMobile=false
    }
    window.addEventListener("resize", ()=>{
      if(window.innerWidth <= 768){
        this.isMobile=true
      }else{
        this.isMobile=false
      }
    });
  }

  onLogout(){
    this.resourceService.clearUserRoleToStorage();
    localStorage.clear();
    window.location.href = 'http://127.0.0.1:9000/logout';
  }

  onLogin(){
    this.router.navigate(['login']);
  }

  getLogged(){
    this.resourceService.logged().subscribe(data =>{
      if(data.message != null){
        this.isLogged=true;
        this.getAdmin(data);
      }else{
        console.log("Não logado");
      }
    });
  }

  getAdmin(data:any){
      if(data.message.includes('ADMIN') || data.message.includes('OIDC_USER')){
        this.isAdmin=true;
      }
  }

  goToPersonalInfo(){
    this.router.navigate(['admin/user-profile'])
  }
}
