import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { ReservationsService } from 'src/app/services/reservations.service';
import { IonModal } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    FormsModule
  ]
})

export class ReservationDetailComponent implements OnInit, OnChanges {

  @Input()
  serviceId: number;

  @Input()
  reservationId: number;

  reservationList: any[] = [];

  reservationInfo: any;
  reservationName: string;
  reservationEmail: string;
  reservationStatus: string;
  reservationHora: string;
  reservationPhone: string;
  reservationDate: string;
  reservationAddInfo:string;

  notNull: boolean = false;
  addInfoExists:boolean = false;
  isAguardando:boolean;
  isRejeitado:boolean;


  constructor(private reservationService: ReservationsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    changes = {
      'reservationId': changes['reservationId']
    };

    if ('reservationId' in changes) {
      let currentValue = changes['reservationId'].currentValue;
      this.reservationId = currentValue;
      this.getReservationsByServiceId(this.serviceId);
    }
  }


  ngOnInit() {
    this.getReservationsByServiceId(this.serviceId);
  }

  getReservationsByServiceId(serviceId: number) {
    this.reservationService.getReservationList(serviceId).subscribe(
      data => {
        this.reservationList = data;
        this.getReservationInfo(this.reservationId);
      }
    );
  }

  getReservationInfo(reservationId: number) {

    if (reservationId !== undefined) {
      this.reservationList.filter(el => {
        this.reservationInfo = el;
        if (this.reservationInfo.id === reservationId) {
          this.reservationName = this.reservationInfo.user.name;
          this.reservationEmail = this.reservationInfo.user.email;
          this.reservationPhone = this.reservationInfo.user.phone;
          this.reservationStatus = this.reservationInfo.status;
          this.reservationHora = 'Das ' + this.reservationInfo.startTime.split(':').slice(0, 2).join(':') + ' até as ' + this.reservationInfo.endTime.split(':').slice(0, 2).join(':');
          this.reservationDate = this.reservationInfo.date.split('-').reverse().join('/').toString();

          if(this.reservationInfo.additionalInfo !== null){
            this.addInfoExists = true;
            this.reservationAddInfo = this.reservationInfo.additionalInfo;
          }
          this.notNull = true;
        }
      });
      
      if(this.reservationStatus.includes('AGUARDANDO')){
        this.isAguardando = true;
      }else{
        this.isAguardando = false;
      }

      if(this.reservationStatus.includes('REJEITADO')){
        this.isRejeitado = true;
      }else{
        this.isRejeitado = false;
      }
    } else {
      return console.log('Nenhuma reserva selecionada');
    }
  }

  setStatusColor(ev: any) {
    if (ev === 'AGUARDANDO_APROVACAO') {
      return 'aguardando'
    } else if (ev === 'APROVADO') {
      return 'aprovado'
    } else {
      return 'rejeitado'
    }
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

  @ViewChild('removeModal') removeModal:IonModal;
  remove(){
    this.removeModal.present();
  }

  updateReservationStatus(){
    let status = {
      'status': this.reservationStatus
    }
    this.reservationService.updateReservation(this.serviceId, this.reservationId, status).subscribe();
    location.reload();
  }

  removeReservation(){
    this.reservationService.deleteReservationById(this.serviceId, this.reservationId).subscribe();
    location.reload();
  }
}
