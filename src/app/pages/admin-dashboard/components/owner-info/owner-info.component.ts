import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { ResourceService } from 'src/app/services/resource.service';
import {Clipboard} from '@angular/cdk/clipboard';

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

  publicLink:string="";

  profileImg:string = 'https://blog.davidstea.com/en/wp-content/uploads/2018/04/Placeholder.jpg'

  constructor(private resourceService: ResourceService, private router:Router, private clipboard: Clipboard) { 
    
  }

  ngOnInit() {
    if(this.currentUserInfoEmail && this.currentUserInfoName && this.currentUserInfoPhone === ' '){
      this.resourceService.currentUser().subscribe(data =>{
        if(data.role === "ADMIN"){
          this.isAdmin = true;
        }
        this.setUserInfos(data);
      })
    }   
    
  }

  setUserInfos(data){
    this.currentUserInfoName= data.name;
    this.currentUserInfoEmail= data.email;
    this.currentUserInfoPhone= data.phone;
    this.publicLink = (location.origin+'/page/'+this.currentUserInfoName.replace(' ', '%20'));
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
    let role = this.resourceService.getUserRoleToStorage();
    if(role === "USER" || !role){
      this.router.navigate([`page/${this.currentUserInfoName}`]);
    }else{
      this.router.navigate(['admin/dashboard']);
    }
  }

}
