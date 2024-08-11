import { CriptoService } from 'src/app/services/cripto.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { OwnerInfoComponent } from '../admin-dashboard/components/owner-info/owner-info.component';
import { ReservationListComponent } from '../admin-dashboard/components/reservation-list/reservation-list.component';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
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
  @ViewChild(ReservationListComponent) reservationList!: ReservationListComponent;

  loaded: boolean;
  isSearchFill: boolean = false
  totalReservas: string;
  searchText: string = '';
  totalReservasPosition:string = 'end';

  constructor(private criptoService: CriptoService) { }

  ionViewWillEnter(): void {
    this.loadData();
    if (localStorage.getItem('reservas')) {
      this.totalReservas = JSON.parse(this.criptoService.getEncryptItem('reservas')).length;
    } else {
      this.totalReservas = '...';
    }
  }

  ionViewWillLeave(): void {
    this.loaded = false;
  }

  ngOnInit() {
    this.loadData();
    if(innerWidth <= 768){
      this.totalReservasPosition = "start"
    }
  }

  ngOnDestroy(): void {
    this.loaded = false;
  }

  loadData() {
    if (localStorage.getItem('reservas')) {
      this.loaded = true
    }else{
      console.log('Sem reservas ainda :(');
      this.loaded = false
    }
  }

  search() {
    if (this.searchText !== '') {
      this.isSearchFill = true;
      this.reservationList.search(this.searchText);
    } else {
      this.isSearchFill = false;
    }
  }

  clear() {
    this.isSearchFill = false;
    this.searchText = '';
    this.reservationList.clear();
  }
}
