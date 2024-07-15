import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonApp, IonRouterOutlet, IonNav, IonBackButton } from '@ionic/angular/standalone';
import { MenuComponent } from "./components/menu/menu.component";
import { HttpClientModule } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { ResourceService } from './services/resource.service';
import { UsersService } from './services/users.service';
import { CriptoService } from './services/cripto.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonBackButton, IonNav, IonApp, IonRouterOutlet, MenuComponent, HttpClientModule],
  providers: [
  ]
})
export class AppComponent implements OnInit {
  @ViewChild('menu') menu: MenuComponent;

  constructor(private criptoService: CriptoService, private router: Router, private resourceService: ResourceService, private userService: UsersService) { }

  currentUser: any;
  usersServices: any[] = [];
  roleUser: string
  servicesData: any[] = [];
  profilePicture: string;

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.menu.getLogged();
    });
    
    this.loadInitialData();
    //this.loadInitialDataMocked();
  }

  loadInitialData() {
    this.resourceService.currentUser().subscribe(
      data => {
        this.criptoService.setItemToLocalStorage(JSON.stringify(data), 'currentUser')
        if(data.getProfilePicture !== null){
          this.profilePicture = `/resource/pic/db/${data.getProfilePicture.name}`;
        }else{
          this.profilePicture = `https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg`;
        }
        this.criptoService.setItemToLocalStorage(this.profilePicture, 'userProfilePicture');
        this.criptoService.setItemToLocalStorage(data.id.toString(), 'userIdentification');

        this.userService.getUserById(data.id).subscribe(data => {
          this.usersServices = data.services;

          if (this.usersServices !== null || this.usersServices !== undefined) {
            this.usersServices.forEach(el => {
              this.servicesData.push(el);
            });
            this.criptoService.setItemToLocalStorage(JSON.stringify(this.servicesData), 'servicesData');
            this.servicesData = JSON.parse(this.criptoService.getEncryptItem('servicesData'));
          }
          this.setRoleUserToStorage(data);
        });
      }
    )
  }

  loadInitialDataMocked() {
    localStorage.setItem("role", "ADMIN")
    this.userService.getUserByIdMock(92).subscribe(data => {
      this.usersServices = data.services;

      if (this.usersServices !== null || this.usersServices !== undefined) {
        this.usersServices.forEach(el => {
          this.servicesData.push(el);
        });
        this.criptoService.setItemToLocalStorage(JSON.stringify(this.servicesData), 'servicesData');
        this.servicesData = JSON.parse(this.criptoService.getEncryptItem('servicesData'));
      }
      this.setRoleUserToStorage(data);
      this.criptoService.setItemToLocalStorage(JSON.stringify(data), 'currentUser')
      console.log(data);
      this.profilePicture = `https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg`;
      this.criptoService.setItemToLocalStorage(this.profilePicture, 'userProfilePicture');
      this.criptoService.setItemToLocalStorage(data.id.toString(), 'userIdentification');
    });
  }

  setRoleUserToStorage(data: any) {
    this.currentUser = data;
    this.roleUser = data.role;
    this.resourceService.setUserRoleToStorage(this.roleUser);
  }

}
