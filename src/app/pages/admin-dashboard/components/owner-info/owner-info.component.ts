import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/modules/common-module/shared';
import {Clipboard} from '@angular/cdk/clipboard';
import { UsersService } from 'src/app/services/users.service';
import { CriptoService } from 'src/app/services/cripto.service';

@Component({
  selector: 'app-owner-info',
  templateUrl: './owner-info.component.html',
  styleUrls: ['./owner-info.component.scss'],
  standalone: true,
  imports:[SharedModule]
})
export class OwnerInfoComponent  implements OnInit {
  isAdmin:boolean = false;
  isCopied:boolean = false;

  @Input()
  currentUserInfoName: string = ' ';
  @Input()
  currentUserInfoEmail: string  = ' ';
  @Input()
  currentUserInfoPhone: string  = ' ';
  @Input()
  profileImg:string = 'https://blog.davidstea.com/en/wp-content/uploads/2018/04/Placeholder.jpg'

  publicLink:string="";

  constructor(private router:Router, private clipboard: Clipboard, private userService:UsersService, private criptoService:CriptoService) { 
    
  }

  ngOnInit() {
    if((this.currentUserInfoEmail && this.currentUserInfoName && this.currentUserInfoPhone) === ' '){
      this.userService.getUserById(this.criptoService.getEncryptItem('userIdentification')).subscribe(data=>{
        if(data.role === "ADMIN"){
          this.isAdmin = true;
        }
        this.setUserInfos(data);
      });
    }
  }

  setUserInfos(data){
    this.currentUserInfoName= data.name;
    this.currentUserInfoEmail= data.email;
    this.currentUserInfoPhone= data.phone;
    this.publicLink = (location.origin+'/page/'+this.currentUserInfoName);
    this.profileImg = this.criptoService.getEncryptItem('userProfilePicture');
  }

  editInfo(){
    this.router.navigate(['admin/user-profile']);
  }

  copyLink(){
    this.clipboard.copy(this.publicLink);
    this.isCopied = true
    setTimeout(()=>{
      this.isCopied = false
    }, 980)
  }

  goToPublicPage(){
    let role = localStorage.getItem('role');
    if(role === "USER" || !role){
      this.router.navigate([`page/${this.currentUserInfoName}`]);
    }else{
      this.router.navigate(['admin/dashboard']);
    }
  }

}
