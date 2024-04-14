import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { OwnerInfoComponent } from '../admin-dashboard/components/owner-info/owner-info.component';
import { ReservationListComponent } from '../admin-dashboard/components/reservation-list/reservation-list.component';
import { ResourceService } from 'src/app/services/resource.service';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Router } from '@angular/router';
import { ReservationsService } from 'src/app/services/reservations.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    OwnerInfoComponent,
    FormsModule,
    ReservationListComponent
  ]
})
export class ReservasPage implements OnInit, OnDestroy, ViewWillLeave, ViewWillEnter {
  @ViewChild(ReservationListComponent) reservationList!:ReservationListComponent;

  currentUserId: number;
  servicesId: number[] = [];
  subReservation: Subscription;
  loaded:boolean;
  isSearchFill:boolean=false
  totalReservas:string;
  searchText:string = '';

  constructor(private resourceService: ResourceService, private userService: UsersService, private router:Router, private reservationService:ReservationsService) { }

  ngOnInit() {
    this.subReservation = this.loadData()
    this.searchText
  }

  ngOnDestroy(): void {
    this.subReservation.unsubscribe()
  }

  ionViewWillEnter(): void {
    this.subReservation = this.loadData()
    if(localStorage.getItem('reservas')){
      this.totalReservas = JSON.parse(localStorage.getItem('reservas')).length;
    }else{
      this.totalReservas='...';
    }
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

  search(){
    if(this.searchText !== ''){
      this.isSearchFill = true;
      this.reservationList.search(this.searchText);
    }else{
      this.isSearchFill = false;
    }
  }

  clear(){
    this.isSearchFill=false;
    this.searchText='';
    this.reservationList.clear();
  }
}
