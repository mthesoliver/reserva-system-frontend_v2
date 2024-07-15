import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { OwnerInfoComponent } from '../admin-dashboard/components/owner-info/owner-info.component';
import { ServicesBoardComponent } from '../admin-dashboard/components/services-board/services-board.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.page.html',
  styleUrls: ['./public-profile.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    OwnerInfoComponent,
    ServicesBoardComponent
  ]
})
export class PublicProfilePage implements OnInit, ViewWillEnter, ViewWillLeave {

  subOwnerInfos: Subscription

  currentUserId: number;
  activeServices: any[] = [];
  servicesId: number[] = [];

  serviceId: any;
  userId: number;

  loaded: boolean;

  serviceOwnerName: string;

  currentUserInfoName: string;
  currentUserInfoEmail: string;
  currentUserInfoPhone: string;
  profileImg:string;

  constructor(private userService: UsersService, private activatedRoute: ActivatedRoute) {
    this.serviceOwnerName = this.activatedRoute.snapshot.paramMap.get("name");
  }

  ionViewWillEnter(): void {
    this.activeServices = [];
    this.subOwnerInfos = this.loadOwnerInfos();
  }

  ionViewWillLeave(): void {
    this.subOwnerInfos.unsubscribe();
  }

  ngOnInit() {
    return this.userService.getUserById(this.serviceOwnerName).subscribe(
      data => {
        this.userId = data.id;
      }
    )
  }

  ngOnDestroy(): void {
    this.subOwnerInfos.unsubscribe();
  }

  loadOwnerInfos() {
    return this.userService.getUserById(this.serviceOwnerName).subscribe(
      data => {
        console.log(data.profilePicture.name);
        this.currentUserInfoName = data.name;
        this.currentUserInfoEmail = data.email;
        this.currentUserInfoPhone = data.phone;
        this.userId = data.id;
        if(data.profilePicture.name !== null){
          this.profileImg = `/resource/pic/db/${data.profilePicture.name}`
        }
        this.loadOwnerServices(data.services)
      }
    )
  }

  loadOwnerServices(services){
    services.forEach(el => {
      el = {
        serviceId: el.serviceId,
        serviceName: el.serviceName,
        timeWork: `${(el.startTime).slice(0, 5)}h as ${(el.endTime).slice(0, 5)}h`
      }
      this.servicesId.push(el.serviceId);
      this.activeServices.push(el)
    })
  }

}
