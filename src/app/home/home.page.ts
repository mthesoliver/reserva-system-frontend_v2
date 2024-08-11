import { ResourceService } from './../services/resource.service';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpModuleModule } from '../modules/http-module/http-module.module';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpModuleModule
  ],
})
export class HomePage implements OnInit {
  private isLogged:boolean;
  username:string ="";

  constructor(private resourceService: ResourceService, private route: Router) {
  }


  ngOnInit(): void {
    this.resourceService.logged().subscribe(data=>{
      if(data.message != null) this.isLogged = true
    },
    err =>{
      this.route.navigate(['login']);
    });
    this.resourceService.currentUser().subscribe()
  }
  

}
