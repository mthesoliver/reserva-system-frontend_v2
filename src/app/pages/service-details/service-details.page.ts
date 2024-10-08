import { CriptoService } from 'src/app/services/cripto.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { CalendarComponent, CalendarMode, NgCalendarModule, Step } from 'ionic2-calendar';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute } from '@angular/router';
import { ReservationListComponent } from '../admin-dashboard/components/reservation-list/reservation-list.component';
import { ReservationDetailComponent } from './components/reservation-detail/reservation-detail.component';
import { ConvertDaysService } from 'src/app/services/convert-days.service';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
export interface IEvent {
  id:number;
  allDay: boolean;
  endTime: Date;
  startTime: Date;
  title: string;
  category?: string;
}
@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.page.html',
  styleUrls: ['./service-details.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    NgCalendarModule,
    ReservationListComponent,
    ReservationDetailComponent
  ]
})
export class ServiceDetailsPage implements OnInit, OnDestroy, ViewWillLeave, ViewWillEnter {

  @ViewChild(CalendarComponent) myCal!: CalendarComponent;
  @ViewChild('timeButtons') timeButtons: any;

  subService: Subscription;
  serviceId: any;
  reservationId:number;
  currentUserId:number;

  existentService: boolean;
  isLoaded:boolean;

  actualService = {}
  serviceName:string;

  eventSource;
  reservationsData: any[] = [];
  viewTitle;

  setStartHour: number = 0;
  setEndHour: number = 0;

  diasOpen = [];
  horariosDisponiveis = [];

  isToday: boolean;
  calendar = {
    allDay: false,
    mode: 'month' as CalendarMode,
    step: 30 as Step,
    currentDate: new Date(),
    dateFormatter: {
      formatMonthViewDay: function (date: Date) {
        return date.getDate().toLocaleString();
      }
    },
  };


  constructor(private activatedRoute: ActivatedRoute, private userService: UsersService, private criptoService:CriptoService, private convertDays:ConvertDaysService) { }

  ionViewWillEnter(): void {
    this.subService = this.loadData()
    this.reservationsData = JSON.parse(this.criptoService.getEncryptItem('reservas'));
    this.isLoaded = true;
  }

  ionViewWillLeave(): void {
    this.reservationsData=[];
    this.eventSource = [];
    this.existentService = false;
    this.isLoaded = false;
    this.reservationId=null;
    this.subService.unsubscribe();
    this.onCurrentDateChanged(new Date);
  }

  ngOnInit() {
    this.serviceId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    this.isLoaded = true;
    this.today();
  }

  ngOnDestroy(): void {
    this.reservationsData=[];
    this.eventSource = [];
    this.existentService = false;
    this.isLoaded = false;
    this.subService.unsubscribe();
    localStorage.removeItem('horas');
  }

  loadData() {
    this.currentUserId = parseInt(this.criptoService.getEncryptItem('userIdentification'));
    return this.userService.getUserById(this.currentUserId).subscribe(
          data => {
            data.services.forEach(el => {
              if (el.serviceId === parseInt(location.href.split('/').slice(-1).toString())) {
                this.actualService = el;

                this.setStartHour = parseInt(this.actualService['startTime']);
                this.setEndHour = parseInt(this.actualService['endTime']);

                this.availableHours(this.actualService);
                this.setDaysOpen(this.actualService['availableDays']);
                this.loadEventsOnCalendar(this.actualService);
                
                this.serviceName = this.actualService['serviceName'];
              }
            })
          }
        )
  }

  loadEventsOnCalendar(actualService) {
    let filtered = this.reservationsData.filter((el) => {
      return el.servico === actualService['serviceName'];
    });

    let event: any[] = [];

    filtered.map(el => {
      let startTime = el['horario'].split(' ').slice(0,1).toString().replace('h', '')
      let endTime = el['horario'].split(' ').slice(-1).toString().replace('h', '')
      let ano = el['data'].substring(0,4);
      let mes = parseInt(el['data'].substring(5,7)) -1;
      let dia = el.data.substring(8,10);
      
      let hour = startTime.split(':').slice(0,1).toString()
      let minute = startTime.split(':').slice(1,2).toString()

      let hour2 = endTime.split(':').slice(0,1).toString()
      let minute2 = endTime.split(':').slice(1,2).toString()

      let dataStart = new Date(Date.UTC(ano, mes, dia, parseInt(hour)+3, minute2 ))
      let dataEnd = new Date(Date.UTC(ano, mes, dia, parseInt(hour2)+3, minute ))

      let parseEvent: IEvent = {
        'id': el['idReserva'],
        'allDay': false,
        'startTime': dataStart,
        'endTime': dataEnd,
        'title': el['cliente'],
        'category': el['situacao']
      }

      if(parseEvent.category !== "REJEITADO"){
        event.push(parseEvent);
      }
      return event;
    });

    this.eventSource = event;
  }  

  calendarBack() {
    this.myCal.slidePrev();
  }

  calendarForward() {
    this.myCal.slideNext();
  }


  loadEvents() {
    console.log(this.eventSource);
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    this.reservationId = event.id;
  }

  getReservationId(){
    return this.reservationId;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onTimeSelected(ev) {
    this.horariosDisponiveis = JSON.parse(localStorage.getItem('horas'));
    let available:any[]=[]
    available = this.timeButtons.el.children;  
    
    for(let el of available){
      el.disabled=false
      el.setAttribute("color","");
    }

    ev.events.forEach(ev=>{
      let index:number
      for(let hr of available){
        if(hr.innerText.includes(ev.startTime.toLocaleTimeString().split(':').slice(0,2).join(':'))){
          hr.disabled=true;
          hr.setAttribute("color","medium");
          index = this.horariosDisponiveis.indexOf(hr.innerText) + 1;
        }
        if(hr.innerText.includes(this.horariosDisponiveis[index])){
          hr.disabled=true;
          hr.setAttribute("color","medium");
        }
        if(hr.innerText.includes(ev.endTime.toLocaleTimeString().split(':').slice(0,2).join(':'))){
          hr.disabled=true;
          hr.setAttribute("color","medium");
        }
      }
    });
  }

  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);

    Promise.resolve().then(()=>{
      if( today.getTime() === event.getTime()){
        this.isToday = true;
      }else{
        this.isToday = false;
      }
    })
  }

  markDisabled = (date: Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return (
      date < current ||
      (date.getDay() !== this.diasOpen[0] &&
        date.getDay() !== this.diasOpen[1] &&
        date.getDay() !== this.diasOpen[2] &&
        date.getDay() !== this.diasOpen[3] &&
        date.getDay() !== this.diasOpen[4] &&
        date.getDay() !== this.diasOpen[5] &&
        date.getDay() !== this.diasOpen[6])
    );
  };

  setDaysOpen(arr:any) {
    this.convertDays.convertDaysOfDatabaseToIndex(arr, this.diasOpen);
    this.today();
  }

  availableHours(data) {
    let horarioInicio = data.startTime.slice(0, 5);
    let horarioFinal = data.endTime.slice(0, 5);

    for (let i = parseInt(horarioInicio); i < parseInt(horarioFinal); i++) {
      if(i<10){
      this.horariosDisponiveis.push('0' + i + ':00h');
      this.horariosDisponiveis.push('0' + i + ':30h');
      }else{
        this.horariosDisponiveis.push(i + ':00h');
        this.horariosDisponiveis.push(i + ':30h');
      }
    }

    localStorage.setItem('horas', JSON.stringify(this.horariosDisponiveis));
  }

  verifyIsserviceExists(id) {
    if (parseInt(location.href.split('/').slice(-1).toString()) === id) {
      this.existentService = true;
    } else {
      this.existentService = false;
    }
  }

}
