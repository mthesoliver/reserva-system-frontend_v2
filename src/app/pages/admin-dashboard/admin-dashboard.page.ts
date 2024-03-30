import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OwnerInfoComponent } from './components/owner-info/owner-info.component';
import { ResourceService } from 'src/app/services/resource.service';
import { ServicesBoardComponent } from './components/services-board/services-board.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ServicesService } from 'src/app/services/services.service';
import { UsersService } from 'src/app/services/users.service';
import { ReservationsService } from 'src/app/services/reservations.service';
import { Reservation } from 'src/app/model/reservation';

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
export class AdminDashboardPage implements OnInit {
  currentUserId: number;
  activeServices: any[] = [];
  reservationList: Reservation[] = [];

  serviceId: any;
  userId: number;

  editInfoClick:boolean=false

  constructor(private resourceService: ResourceService, private services: ServicesService, private userService: UsersService) {
  }

  ngOnInit() {

    this.resourceService.currentUser().subscribe(data => {
      this.currentUserId = data.id;
      this.userId = data.id;

      this.userService.getUserById(this.userId).subscribe(
        data => {
          data.services.forEach(el => {
            el={
              serviceId:el.serviceId,
              serviceName: el.serviceName,
              timeWork: `${(el.startTime).slice(0,5)}h as ${(el.endTime).slice(0,5)}h`
            }
            this.activeServices.push(el)
          })
        })
    })
    
    this.serviceId = this.resourceService.getServiceIdToStorage();

  }



  editInfo(){
    this.editInfoClick = true
    console.log(this.editInfoClick);
  }

}

