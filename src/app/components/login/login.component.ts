import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';


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
  // authorize_uri = environment.authorize_gateway;

  // params: any = {
  //   response_type: environment.response_type,
  //   client_id: environment.client_id,
  //   scope: environment.scope,
  //   redirect_uri: environment.redirect_uri,
  //   response_mode: environment.response_mode,
  //   code_challenge_method: environment.code_challenge_method
  // }

  constructor(private userService: UsersService, private route:Router) { 
  }

  ngOnInit() {
    this.onLogin();
  }

  onLogin(): void {
    //location.href='http://127.0.0.1:8081/oauth2/authorization/gateway?'
    location.href='http://reserva-gateway:8081/oauth2/authorization/gateway?'
  }

}
