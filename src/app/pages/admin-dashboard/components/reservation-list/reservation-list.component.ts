import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { MatTableModule } from '@angular/material/table';
import { Reservation } from 'src/app/model/reservation';
import { ServicesService } from 'src/app/services/services.service';
import { ResourceService } from 'src/app/services/resource.service';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';


const RESERVATION_LIST: Reservation[] = [
  // { idReserva: 1, cliente: 'Acelino', servico: 'Lab1', data: '29/04/2024', horario: '10h as 11h', situacao: 'Aguardando' },
];

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    MatTableModule
  ]
})
export class ReservationListComponent implements OnInit, OnDestroy {

  serviceId: any[] = [];
  currentUserId: number;
  subReservation: Subscription

  reservationList: Reservation[] = [];
  displayedColumns: string[] = ['idReserva', 'cliente', 'servico', 'horario', 'data', 'situacao'];

  dataSource;
  clickedRows = new Set<Reservation>();
  loaded: boolean

  constructor(private services: ServicesService, private resourceService: ResourceService, private userService: UsersService) { }

  ngOnInit() {
    this.subReservation = this.loadData();
  }

  ngOnDestroy(): void {
    this.subReservation.unsubscribe();
    localStorage.removeItem('reservas');
  }

  loadData() {
    return this.resourceService.currentUser().subscribe((data) => {
      this.currentUserId = data.id;
      this.loadUserInfo(this.currentUserId);
    });
  }

  loadUserInfo(id) {
    this.userService.getUserById(id).subscribe(
      data => {
        data.services.forEach(el => {
          el = {
            serviceId: el.serviceId,
          }
          this.serviceId.push(el)
        })
        

      this.loadReservations(this.serviceId);
      })
  }

  loadReservations(ids:number[]){
  return ids.forEach(el=>{
      this.services.getServicesById(el['serviceId']).subscribe(data=>{
        data.forEach(el => {
              for (const element of el.reservations) {
                let reservation =
                  [{
                    idReserva: element.reservationId,
                    cliente: element.user.name,
                    servico: el.serviceName,
                    horario: `${element.startTime.slice(0, 5)}h as ${element.endTime.slice(0, 5)}h`,
                    data: element.date,
                    situacao: element.status
                  }]
                  
                this.reservationList.push(...reservation);
              };
            });
            
            localStorage.setItem('reservas', JSON.stringify(this.reservationList));
            this.dataSource = JSON.parse( localStorage.getItem('reservas'));
      });
    });

  }
  

}
