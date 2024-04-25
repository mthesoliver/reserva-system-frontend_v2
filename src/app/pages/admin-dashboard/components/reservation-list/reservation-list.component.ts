import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { MatTableModule } from '@angular/material/table';
import { Reservation } from 'src/app/model/reservation';
import { ServicesService } from 'src/app/services/services.service';
import { ResourceService } from 'src/app/services/resource.service';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { ReservationDetailComponent } from 'src/app/pages/service-details/components/reservation-detail/reservation-detail.component';
import { IonModal } from '@ionic/angular';
import { CriptoService } from 'src/app/services/cripto.service';


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
    MatTableModule,
    ReservationDetailComponent
  ]
})
export class ReservationListComponent implements OnInit, OnDestroy {

  servicesIds: any[] = [];
  serviceId: number;
  reservationId: number;

  currentUserId: number;
  subReservation: Subscription

  reservationList: Reservation[] = [];
  displayedColumns: string[] = ['idReserva', 'dateTimeRequest', 'cliente', 'servico', 'horario', 'data', 'situacao'];

  dataSource;
  loaded: boolean
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

  constructor(private services: ServicesService, private resourceService: ResourceService, private userService: UsersService, private criptoService:CriptoService) { }

  ngOnInit() {
    this.subReservation = this.loadData();
  }

  ngOnDestroy(): void {
    this.subReservation.unsubscribe();
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
          this.servicesIds.push(el)
        })

        this.loadReservations(this.servicesIds);
      })
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

        let listLimiter: any[] = JSON.parse(this.criptoService.getEncryptItem('reservas'));

        if (this.limiter === null) {
          this.dataSource = listLimiter.slice(this.actualPage, this.actualPage + this.itensPerPage);
        } else {
          let filtered: any[] = listLimiter.filter(stat => {
            return stat.situacao.includes('AGUARDANDO');
          })
          this.dataSource = filtered.slice(0, this.limiter);
          this.showToolBar = false;
        }
      });
    });

  }

  nextPage() {
    let listLimiter: any[] = JSON.parse(this.criptoService.getEncryptItem('reservas'));

    if (this.actualPage === 0) {
      this.actualPage = this.itensPerPage;
    }

    if (listLimiter.length > this.actualPage) {
      this.dataSource = listLimiter.slice(this.actualPage, this.actualPage + this.itensPerPage);
      this.actualPage += this.itensPerPage;

      if (this.totalItensLoad < this.reservationList.length) {
        this.totalItensLoad += this.dataSource.length;
      } else {
        this.totalItensLoad = this.reservationList.length;
      }
    }
  }

  previousPage() {
    let listLimiter: any[] = JSON.parse(this.criptoService.getEncryptItem('reservas'));

    if (this.actualPage !== this.itensPerPage && this.actualPage > 0) {
      this.actualPage -= this.itensPerPage;
    }

    if (this.totalItensLoad !== 0 && this.actualPage > 0) {
      this.totalItensLoad -= this.dataSource.length;
    } else {
      this.totalItensLoad = this.itensPerPage;
    }

    if (this.actualPage > 0) {
      this.dataSource = listLimiter.slice(this.actualPage - this.itensPerPage, this.actualPage);
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
    let listLimiter: any[] = JSON.parse(this.criptoService.getEncryptItem('reservas'));

    if (searchText.length > 1) {
      this.reservationList.forEach(el => {
        if (el.cliente.toLowerCase().includes(searchText.toLowerCase())) {
          find.push(el);
        } else {
          console.log('Cliente não encontrado');
        }
      })
      this.allowPagination = false;
      this.dataSource = find;
      return this.dataSource;
    }
    else {
      this.allowPagination = true;
      this.dataSource = listLimiter.slice(this.actualPage, this.actualPage + this.itensPerPage);
      return this.dataSource;
    }
  }

  clear() {
    let listLimiter: any[] = JSON.parse(this.criptoService.getEncryptItem('reservas'));
    this.allowPagination = true;
    this.dataSource = listLimiter.slice(this.actualPage, this.actualPage + this.itensPerPage);
  }

  @ViewChild(IonModal) modal: IonModal;

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

  @ViewChild('filterModal') filterModal: IonModal;

  openFilterOptions(ev: any) {
    this.filterModal.present();
  }


  filterBy(param: any, param2?: any, param3?: any) {
    this.filterChips = [];
    let listLimiter: any[] = JSON.parse(this.criptoService.getEncryptItem('reservas'));
    let filteredResults: any[] = [];

    if (param.value !== undefined && param2.value === undefined) {
      listLimiter.filter(el => {
        if (el[`${param.name}`] === param.value) {
          filteredResults.push(el);
        }
      });
      
      if(param3.value === 'Mais antigos' ){
        this.sortedOldest(filteredResults)
        this.filterChips.push(param3);
      }else if(param3.value === 'Mais recentes'){
        this.sortedNewest(filteredResults)
        this.filterChips.push(param3);
      }

      this.filterChips.push(param);
    } else if (param2.value !== undefined && param.value === undefined) {
      listLimiter.filter(el => {
        if (el[`${param2.name}`] === param2.value) {
          filteredResults.push(el);
        }
      });
      
      if(param3.value === 'Mais antigos' ){
        this.sortedOldest(filteredResults)
        this.filterChips.push(param3);
      }else if(param3.value === 'Mais recentes'){
        this.sortedNewest(filteredResults)
        this.filterChips.push(param3);
      }
      this.filterChips.push(param2);
    } else if (param3.value !== undefined && param.value === undefined && param2.value === undefined) {
      if (param3.value === 'Mais recentes') {
        filteredResults = this.sortedNewest(listLimiter);
      }else{
        filteredResults = this.sortedOldest(listLimiter);
      }
      this.filterChips.push(param3);
    } else {
      listLimiter.filter(el => {
        if (el[`${param.name}`] === param.value && el[`${param2.name}`] === param2.value) {
          filteredResults.push(el);
        }
      })
      
      this.filterChips.push(param);
      this.filterChips.push(param2);

      if(param3.value === 'Mais antigos' ){
        this.sortedOldest(filteredResults)
        this.filterChips.push(param3);
      }else if(param3.value === 'Mais recentes'){
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
    } else if(this.filterChips.length === 1){
      this.filterBy(this.filterChips[0], {'value': undefined }, { 'value': undefined });
    }else {
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