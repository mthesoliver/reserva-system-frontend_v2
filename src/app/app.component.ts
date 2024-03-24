import { NavigationEnd, Router } from '@angular/router';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { MenuComponent } from "./components/menu/menu.component";
import { HttpClientModule } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { ResourceService } from './services/resource.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    standalone: true,
    imports: [IonApp, IonRouterOutlet, MenuComponent, HttpClientModule],
    providers:[ 
    ]
})
export class AppComponent implements OnInit{
  @ViewChild('menu') menu: MenuComponent;

  constructor(private router: Router, private resourceService:ResourceService) {}

  currentUser:any;

  @Input()
  roleUser:string

  ngOnInit(): void {    
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(()=>{
      this.menu.getLogged();
    })

    this.resourceService.currentUser().subscribe(data =>{
      this.currentUser = data;
      this.roleUser = data.role;

      this.resourceService.setUserRoleToStorage(this.roleUser)
    });
}
  
}
