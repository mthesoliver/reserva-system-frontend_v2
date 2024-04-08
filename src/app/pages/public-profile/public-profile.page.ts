import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { OwnerInfoComponent } from '../admin-dashboard/components/owner-info/owner-info.component';
import { ServicesBoardComponent } from '../admin-dashboard/components/services-board/services-board.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from 'src/app/services/resource.service';
import { ServicesService } from 'src/app/services/services.service';
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
export class PublicProfilePage implements OnInit {

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

  constructor(private resourceService: ResourceService, private services: ServicesService, private userService: UsersService, private router: Router, private activatedRoute: ActivatedRoute) {
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
        
    console.log(data);
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
        this.currentUserInfoName = data.name;
        this.currentUserInfoEmail = data.email;
        this.currentUserInfoPhone = data.phone;
        this.userId = data.id;
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
