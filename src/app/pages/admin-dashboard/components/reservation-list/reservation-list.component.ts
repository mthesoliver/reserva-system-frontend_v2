import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { MatTableModule } from '@angular/material/table';
import { ReservationsService } from 'src/app/services/reservations.service';
import { Reservation } from 'src/app/model/reservation';
import { ServicesService } from 'src/app/services/services.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const RESERVATION_LIST: Reservation[] = [
  { idReserva: 1, cliente: 'Acelino', servico: 'Lab1', data: '29/04/2024', horario: '10h as 11h', situacao: 'Aguardando' },
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
export class ReservationListComponent implements OnInit {

  reservationList: Reservation[] = [];
  displayedColumns: string[] = ['idReserva', 'cliente', 'servico', 'horario', 'data', 'situacao'];
  dataSource;
  clickedRows = new Set<Reservation>();

  constructor(private reservationService: ReservationsService, private services: ServicesService) { }

  ngOnInit() {
    let serviceName: string;
    this.services.getServicesById(7).subscribe(data => {
      serviceName = data[0].serviceName
    })

    this.reservationService.getReservationList(7).subscribe(
      data => {
        data.forEach(el => {

          let reservation = 
          [{
              idReserva: el.id,
              cliente: el.user.name,
              servico: serviceName,
              horario: `${el.startTime.slice(0,5)}h as ${el.endTime.slice(0,5)}h`,
              data: el.date,
              situacao: el.status
            }]

          this.reservationList.push(...reservation);
        });

        this.dataSource = this.reservationList
      });
  }

}
