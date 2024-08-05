import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { SharedModule } from 'src/app/modules/common-module/shared';
import * as CryptoJS from 'crypto-js';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';


const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone:true,
  imports:[
    SharedModule,
    HttpClientModule
  ]
})
export class LoginComponent  implements OnInit {
  redirecUri = environment.redirect_gateway;

  constructor(private userService: UsersService, private route:Router) { 
  }

  ngOnInit() {
    this.onLogin();
  }

  onLogin(): void {
    location.href= this.redirecUri;
    //location.href='https://reserva-gateway-e7b21d7a04ea.herokuapp.com/oauth2/authorization/gateway?'
  }

}
