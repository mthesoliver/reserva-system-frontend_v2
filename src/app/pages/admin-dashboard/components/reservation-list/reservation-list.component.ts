import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { MatTableModule } from '@angular/material/table';
import { Reservation } from 'src/app/model/reservation';
import { ServicesService } from 'src/app/services/services.service';


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

  @Input()
  serviceId: any;

  reservationList: Reservation[] = [];
  displayedColumns: string[] = ['idReserva', 'cliente', 'servico', 'horario', 'data', 'situacao'];
  @Input()
  dataSource;
  clickedRows = new Set<Reservation>();

  constructor(private services: ServicesService) { }

  ngOnInit() {
    this.services.getServicesById(this.serviceId).subscribe(data => {
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
        }
      });

      this.dataSource = this.reservationList
    })
  }

}
