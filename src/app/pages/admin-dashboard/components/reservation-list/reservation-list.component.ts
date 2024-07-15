import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { MatTableModule } from '@angular/material/table';
import { Reservation } from 'src/app/model/reservation';
import { ServicesService } from 'src/app/services/services.service';
import { ReservationDetailComponent } from 'src/app/pages/service-details/components/reservation-detail/reservation-detail.component';
import { IonModal } from '@ionic/angular';
import { CriptoService } from 'src/app/services/cripto.service';
import { ReservationsService } from 'src/app/services/reservations.service';

// const RESERVATION_LIST: Reservation[] = [
//   { idReserva: 1, cliente: 'Teste', servico: 'Lab1', data: '29/04/2024', horario: '10h as 11h', situacao: 'Aguardando' },
// ];

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    MatTableModule,
    ReservationDetailComponent
  ]
})
export class ReservationListComponent implements OnInit, OnDestroy {
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild('filterModal') filterModal: IonModal;

  servicesIds: any[] = [];
  serviceId: number;
  reservationId: number;

  currentUserId: number;

  reservationList: Reservation[] = [];
  displayedColumns: string[] = ['idReserva', 'dateTimeRequest', 'cliente', 'servico', 'horario', 'data', 'situacao'];

  dataSource;
  @Input()
  limiter: number = null;

  actualPage: number = 0;
  itensPerPage: number = 10;
  @Input()
  allowPagination: boolean;
  showToolBar: boolean = true;

  totalItensLoad: number = this.itensPerPage;

  openFilter: boolean = false;
  filterChips: any[] = [];

  serviceNameList: any[] = [];

  listLimiter: any[] = [];

  constructor(private services: ServicesService, private reservationsService: ReservationsService, private criptoService: CriptoService) { }

  ngOnInit() {
    this.currentUserId = JSON.parse(this.criptoService.getEncryptItem('userIdentification'));
    this.loadUserInfo();
  }

  ngOnDestroy(): void {
    this.servicesIds = null;
  }

  loadUserInfo() {
    let servicesData: any[] = JSON.parse(this.criptoService.getEncryptItem('activeServices'));
    servicesData.forEach(el => {
      el = {
        serviceId: el.serviceId
      }
      this.servicesIds.push(el);
    })
    this.setValueListLimiter();
    this.loadReservations(this.servicesIds);
  }

  loadReservations(ids: number[]) {
    return ids.forEach(el => {
      this.services.getServicesById(el['serviceId']).subscribe(data => {
        this.serviceNameList.push(data[0]['serviceName']);
        data.forEach(el => {
          for (const element of el.reservations) {
            let reservation =
              [{
                idReserva: element.reservationId,
                cliente: element.user.name,
                servico: el.serviceName,
                horario: `${element.startTime.slice(0, 5)}h as ${element.endTime.slice(0, 5)}h`,
                data: element.date,
                situacao: element.status,
                dateTimeRequest: element.dateTimeRequest.slice(0, 16),
              }]

            this.reservationList.push(...reservation);
          };
        });

        let list = this.sortedNewest(this.reservationList);
        this.criptoService.setItemToLocalStorage(JSON.stringify(list), 'reservas');
        this.setListLimiter(this.limiter);
      });
    });
  }

  setValueListLimiter() {
    if (localStorage.getItem('reservas')) {
      this.listLimiter = JSON.parse(this.criptoService.getEncryptItem('reservas'));
    }
  }

  setListLimiter(limiter: number) {
    this.setValueListLimiter();

    if (limiter === null) {
      this.dataSource = this.listLimiter.slice(this.actualPage, this.actualPage + this.itensPerPage);
    } else {
      let filtered: any[] = this.listLimiter.filter(stat => {
        return stat.situacao.includes('AGUARDANDO');
      })
      this.dataSource = this.sortedNewest(filtered.slice(0, this.limiter));
      this.showToolBar = false;
    }
  }

  nextPage() {
    if (this.actualPage === 0) {
      this.actualPage = this.itensPerPage;
    }

    if (this.listLimiter.length > this.actualPage) {
      this.dataSource = this.listLimiter.slice(this.actualPage, this.actualPage + this.itensPerPage);
      this.actualPage += this.itensPerPage;

      if (this.totalItensLoad < this.reservationList.length) {
        this.totalItensLoad += this.dataSource.length;
      } else {
        this.totalItensLoad = this.reservationList.length;
      }
    }
  }

  previousPage() {
    if (this.actualPage !== this.itensPerPage && this.actualPage > 0) {
      this.actualPage -= this.itensPerPage;
    }

    if (this.totalItensLoad !== 0 && this.actualPage > 0) {
      this.totalItensLoad -= this.dataSource.length;
    } else {
      this.totalItensLoad = this.itensPerPage;
    }

    if (this.actualPage > 0) {
      this.dataSource = this.listLimiter.slice(this.actualPage - this.itensPerPage, this.actualPage);
      this.actualPage -= this.itensPerPage;
    }
  }

  setStatusColor(ev: any) {
    if (ev.situacao === 'AGUARDANDO_APROVACAO') {
      return 'aguardando'
    } else if (ev.situacao === 'APROVADO') {
      return 'aprovado'
    } else {
      return 'rejeitado'
    }
  }

  search(searchText: string) {
    let find: any[] = [];

    if (searchText.length > 1) {
      this.reservationList.forEach(el => {
        if (el.cliente.toLowerCase().includes(searchText.toLowerCase())) {
          find.push(el);
        }
      })
      this.allowPagination = false;
      this.dataSource = find;
      return this.dataSource;
    }
    else {
      this.allowPagination = true;
      this.dataSource = this.listLimiter.slice(this.actualPage, this.actualPage + this.itensPerPage);
      return this.dataSource;
    }
  }

  clear() {
    this.allowPagination = true;
    this.dataSource = this.listLimiter.slice(this.actualPage, this.actualPage + this.itensPerPage);
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    location.reload();
  }

  onWillDismiss() {
    this.modal.dismiss();
  }

  click() {
    this.modal.present();
  }

  clickedReservation(ev: any) {
    this.reservationId = ev.idReserva;
    this.services.getServicesByName(ev.servico).subscribe(
      data => {
        this.serviceId = data.serviceId;
        this.modal.present();
      });
  }

  openFilterOptions() {
    this.filterModal.present();
  }


  filterBy(param: any, param2?: any, param3?: any) {
    this.filterChips = [];
    let filteredResults: any[] = [];

    if (param.value !== undefined && param2.value === undefined) {
      this.listLimiter.filter(el => {
        if (el[`${param.name}`] === param.value) {
          filteredResults.push(el);
        }
      });

      if (param3.value === 'Mais antigos') {
        this.sortedOldest(filteredResults)
        this.filterChips.push(param3);
      } else if (param3.value === 'Mais recentes') {
        this.sortedNewest(filteredResults)
        this.filterChips.push(param3);
      }

      this.filterChips.push(param);
    } else if (param2.value !== undefined && param.value === undefined) {
      this.listLimiter.filter(el => {
        if (el[`${param2.name}`] === param2.value) {
          filteredResults.push(el);
        }
      });

      if (param3.value === 'Mais antigos') {
        this.sortedOldest(filteredResults)
        this.filterChips.push(param3);
      } else if (param3.value === 'Mais recentes') {
        this.sortedNewest(filteredResults)
        this.filterChips.push(param3);
      }
      this.filterChips.push(param2);
    } else if (param3.value !== undefined && param.value === undefined && param2.value === undefined) {
      if (param3.value === 'Mais recentes') {
        filteredResults = this.sortedNewest(this.listLimiter);
      } else {
        filteredResults = this.sortedOldest(this.listLimiter);
      }
      this.filterChips.push(param3);
    } else {
      this.listLimiter.filter(el => {
        if (el[`${param.name}`] === param.value && el[`${param2.name}`] === param2.value) {
          filteredResults.push(el);
        }
      })

      this.filterChips.push(param);
      this.filterChips.push(param2);

      if (param3.value === 'Mais antigos') {
        this.sortedOldest(filteredResults)
        this.filterChips.push(param3);
      } else if (param3.value === 'Mais recentes') {
        this.sortedNewest(filteredResults)
        this.filterChips.push(param3);
      }
    }

    this.allowPagination = false;
    this.dataSource = filteredResults;
    this.filterModal.dismiss();
  }

  closeChip(ev: any) {
    this.filterChips.indexOf(ev)

    this.filterChips.forEach(el => {
      if (el.value !== undefined && el.value.includes(ev)) {
        this.filterChips.splice(this.filterChips.indexOf(el), 1);
      }
    });
    if (this.filterChips.length > 1) {
      this.filterBy(this.filterChips[0], this.filterChips[1], { 'value': undefined });
    } else if (this.filterChips.length === 1) {
      this.filterBy(this.filterChips[0], { 'value': undefined }, { 'value': undefined });
    } else {
      location.reload()
    }
  }

  sortedNewest(arr: any) {
    return arr.sort((a, b) => {
      let date = new Date(a.dateTimeRequest);
      let date2 = new Date(b.dateTimeRequest);

      if (date > date2) {
        return -1;
      } else if (date < date2) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  sortedOldest(arr: any) {
    return arr.sort((a, b) => {
      let date = new Date(a.dateTimeRequest);
      let date2 = new Date(b.dateTimeRequest);

      if (date > date2) {
        return 1;
      } else if (date < date2) {
        return -1;
      } else {
        return 0;
      }
    });
  }

}