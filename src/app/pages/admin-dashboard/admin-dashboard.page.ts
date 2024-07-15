import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { OwnerInfoComponent } from './components/owner-info/owner-info.component';
import { ServicesBoardComponent } from './components/services-board/services-board.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ServicesService } from 'src/app/services/services.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CriptoService } from 'src/app/services/cripto.service';

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
export class AdminDashboardPage implements OnInit, OnDestroy, ViewWillLeave, ViewWillEnter {
  subDashboard: Subscription;
  loadData: String = "Recarregar Dados"

  currentUserId: number;
  activeServices: any[] = [];
  servicesId: number[] = [];

  serviceId: any;

  editInfoClick: boolean = false
  loaded: boolean;

  currentTime:any;

  constructor(private services: ServicesService, private router: Router, private criptoService: CriptoService) {
  }

  ionViewWillEnter(): void {
    this.activeServices = [];
    this.subDashboard = this.loadServices(this.currentUserId)
  }

  ionViewWillLeave(): void {
    this.activeServices = [];
    this.subDashboard.unsubscribe()
  }

  ngOnInit() {
    this.currentUserId = parseInt(this.criptoService.getEncryptItem('userIdentification'));
    this.getTime();

    if(window.innerWidth <= 768){
      this.loadData = "";
    }
  }

  ngOnDestroy(): void {
    this.subDashboard.unsubscribe();
  }

  addServices() {
    this.router.navigate(['admin/services', 'create'])
  }

  getTime(){
    let time = new Date()
    return this.currentTime = time.toLocaleDateString() +' as '+ time.toLocaleTimeString();
  }

  loadServices(id:number) {
    let activeServicesArr: any[] = [];
    return this.services.getServicesByOwner(id).subscribe(data=>{
      data.forEach(el => {
          el={
            serviceId: el.serviceId,
            serviceName: el.serviceName,
            timeWork: `${(el.startTime).slice(0, 5)}h as ${(el.endTime).slice(0, 5)}h`
          }
          this.servicesId.push(el.serviceId);
          activeServicesArr.push(el);
          this.loaded = true;
      });
      this.criptoService.setItemToLocalStorage(JSON.stringify(activeServicesArr), 'activeServices');
      this.activeServices = JSON.parse(this.criptoService.getEncryptItem('activeServices'));
    });
  }

  reload(){
    location.reload()
  }

}

