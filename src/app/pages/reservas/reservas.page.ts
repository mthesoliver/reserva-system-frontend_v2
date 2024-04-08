import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { OwnerInfoComponent } from '../admin-dashboard/components/owner-info/owner-info.component';
import { ReservationListComponent } from '../admin-dashboard/components/reservation-list/reservation-list.component';
import { ResourceService } from 'src/app/services/resource.service';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    OwnerInfoComponent,
    ReservationListComponent
  ]
})
export class ReservasPage implements OnInit, OnDestroy, ViewWillLeave, ViewWillEnter {
  currentUserId: number;
  servicesId: number[] = [];
  subReservation: Subscription;
  loaded:boolean;

  constructor(private resourceService: ResourceService, private userService: UsersService, private router:Router) { }

  ngOnInit() {
    this.subReservation = this.loadData()
  }

  ngOnDestroy(): void {
    this.subReservation.unsubscribe()
  }

  ionViewWillEnter(): void {
    this.subReservation = this.loadData()
  }

  ionViewWillLeave(): void {
    this.subReservation.unsubscribe()
  }

  loadData() {
    return this.resourceService.currentUser().subscribe(data => {
      this.currentUserId = data.id;
      this.loadUserInfo(this.currentUserId);
    })
  }

  loadUserInfo(id) {
    this.userService.getUserById(id).subscribe(
      data => {
        data.services.forEach(el => {
          el = {
            serviceId: el.serviceId,
          }
          this.servicesId.push(el)
          this.loaded = true
        })
      })
  }
}
