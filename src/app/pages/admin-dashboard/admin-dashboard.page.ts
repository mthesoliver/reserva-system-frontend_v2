import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { OwnerInfoComponent } from './components/owner-info/owner-info.component';
import { ResourceService } from 'src/app/services/resource.service';
import { ServicesBoardComponent } from './components/services-board/services-board.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ServicesService } from 'src/app/services/services.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { Subscription, first } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OwnerInfoComponent,
    ServicesBoardComponent,
    ReservationListComponent
  ]
})
export class AdminDashboardPage implements OnInit, OnDestroy, ViewWillLeave, ViewWillEnter{
  subDashboard: Subscription;

  currentUserId: number;
  activeServices: any[] = [];
  servicesId:number[]=[];

  serviceId: any;
  userId: number;

  editInfoClick: boolean = false
  loaded:boolean;

  constructor(private resourceService: ResourceService, private services: ServicesService, private userService: UsersService, private router: Router) {
  }
  
  ionViewWillEnter(): void {
    this.activeServices = [];
    this.reloadPage();
    this.subDashboard = this.loadData()
  }

  ionViewWillLeave(): void {
    this.subDashboard.unsubscribe()
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subDashboard.unsubscribe()
  }

  addServices() {
    this.router.navigate(['admin/services', 'create'])
  }

  loadData() {
  return this.resourceService.currentUser().subscribe(data => {
      this.currentUserId = data.id;
      this.userId = data.id;
      this.loadUserInfo(data.id)
    })
  }

  loadUserInfo(id) {
      this.userService.getUserById(id).pipe(first()).subscribe(
      data => {
        data.services.forEach(el => {
          el = {
            serviceId: el.serviceId,
            serviceName: el.serviceName,
            timeWork: `${(el.startTime).slice(0, 5)}h as ${(el.endTime).slice(0, 5)}h`
          }
          this.servicesId.push(el.serviceId);
          this.activeServices.push(el)
          this.loaded = true
        })
      })
  }

  reloadPage() {
    this.router.navigateByUrl('/admin/dashboard', { skipLocationChange: true }).then(() => {
    this.router.navigate([this.router.url]);
    });
    }

}

