import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/modules/common-module/shared';
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
    //location.href= this.redirecUri;
    //location.href='http://127.0.0.1:8081/oauth2/authorization/gateway?'
  }

}
