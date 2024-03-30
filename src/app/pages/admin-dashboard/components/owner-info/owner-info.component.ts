import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from 'src/app/model/userInfo';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'app-owner-info',
  templateUrl: './owner-info.component.html',
  styleUrls: ['./owner-info.component.scss'],
  standalone: true,
  imports:[SharedModule]
})
export class OwnerInfoComponent  implements OnInit {
  isAdmin:boolean = false;

  currentUserInfoName: string;
  currentUserInfoEmail: string;
  currentUserInfoPhone: string;

  profileImg:string = 'https://blog.davidstea.com/en/wp-content/uploads/2018/04/Placeholder.jpg'

  constructor(private resourceService: ResourceService, private router:Router) { }

  ngOnInit() {
    this.resourceService.currentUser().subscribe(data =>{
      if(data.role === "ADMIN"){
        this.isAdmin = true;
      }
      this.setUserInfos(data);
    })
    
  }

  setUserInfos(data){
    this.currentUserInfoName= data.name;
    this.currentUserInfoEmail= data.email;
    this.currentUserInfoPhone= data.phone;
  }

  editInfo(){
    this.router.navigate(['admin/user-profile']);
  }

}
