import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaskitoDirective } from '@maskito/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { NgCalendarModule, CalendarComponent, CalendarMode, Step } from 'ionic2-calendar';
import { Subscription } from 'rxjs';
import { ReturnPageComponent } from 'src/app/components/return-page/return-page.component';
import { InsertReservation } from 'src/app/model/insertReservation';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { OwnerInfoComponent } from 'src/app/pages/admin-dashboard/components/owner-info/owner-info.component';
import { CriptoService } from 'src/app/services/cripto.service';
import { ReservationsService } from 'src/app/services/reservations.service';
import { ServicesService } from 'src/app/services/services.service';
import { UsersService } from 'src/app/services/users.service';

export interface IEvent {
  id:number;
  allDay: boolean;
  endTime: Date;
  startTime: Date;
  title: string;
  category?: string;
}
@Component({
  selector: 'app-service-calendar',
  templateUrl: './service-calendar.page.html',
  styleUrls: ['./service-calendar.page.scss'],
  standalone:true,
  imports:[
    SharedModule,
    NgCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    OwnerInfoComponent,
    MaskitoDirective,
    ReturnPageComponent
  ]
})
export class ServiceCalendarPage implements OnInit , OnDestroy {
  @ViewChild(CalendarComponent) myCal!: CalendarComponent;
  @ViewChild('timeButtons') timeButtons: any;
  @ViewChild('comment') comment:any;

  selectedService:any;
  subService: Subscription;
  subSelectedService: Subscription

  newReservation:InsertReservation = new InsertReservation;
  reservationUser = {
    name:'',
    phone:'',
    email:'',
  };

  currentUserInfoEmail:string;
  currentUserInfoName:string;
  currentUserInfoPhone:string;

  viewTitle;
  title:string;
  content:string;

  setStartHour: number = 0;
  setEndHour: number = 0;

  eventSource;
  insertDiasOpen = [];
  horariosDisponiveis = [];

  reservationsData: any[] = [];

  isToday: boolean;
  isAllChecks:boolean = false;
  isNext: boolean = false;
  isOpenForm:boolean = false
  isReservationSend:boolean = false;

  calendar = {
    allDay: false,
    mode: 'month' as CalendarMode,
    step: 30 as Step,
    currentDate: new Date(),
    dateFormatter: {
      formatMonthViewDay: function (date: Date) {
        return date.getDate().toString();
      },
      formatMonthViewDayHeader: function (date: Date) {
        return 'MonMH';
      },
      formatMonthViewTitle: function (date: Date) {
        return 'testMT';
      },
      formatWeekViewDayHeader: function (date: Date) {
        return 'MonWH';
      },
      formatWeekViewTitle: function (date: Date) {
        return 'testWT';
      },
      formatWeekViewHourColumn: function (date: Date) {
        return 'testWH';
      },
      formatDayViewHourColumn: function (date: Date) {
        return 'testDH';
      },
      formatDayViewTitle: function (date: Date) {
        return 'testDT';
      },
    },
  };

  newReservationForm = this.fb.group({
    nome: [null, Validators.compose([
      Validators.required, Validators.minLength(3), Validators.maxLength(50)
    ])],
    phone: [null, Validators.compose([
      Validators.required, Validators.minLength(10)
    ])],
    email: [null, Validators.compose([
      Validators.required, Validators.email
    ])]
  });

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/,  '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  serviceId:any;
  serviceOwner:string;
  serviceName:string;
  profileImg:string;

  backToOwner:string;
  usersList: any[] = [];

  constructor(private criptoService:CriptoService, private activatedRoute:ActivatedRoute, private fb: FormBuilder, private userService:UsersService, private servicesService:ServicesService, private reservationService:ReservationsService, private router:Router) { }

  ngOnInit() {
    this.serviceId = this.activatedRoute.snapshot.paramMap.get('serviceId');
    this.serviceOwner = this.activatedRoute.snapshot.paramMap.get('name');
    this.backToOwner = location.origin +'/'+ this.activatedRoute.snapshot.url.slice(0,2).join('/').split('%2520').join('%20');

    this.subService = this.loadOwnerInfos();
    this.subSelectedService = this.loadServiceData(this.serviceId);
    this.newReservation.serviceId = this.serviceId;

    this.userService.adminUsers().subscribe(users => {
      this.usersList = users;
      this.newReservationForm.get('email').addValidators([this.emailExists.bind(this)]);
    });
    this.title='Solicitação de reserva feita com sucesso!';
  }

  ngOnDestroy(): void {
    this.subService.unsubscribe();
    this.subSelectedService.unsubscribe();
    localStorage.removeItem('reservas');
  }

  emailExists(control:FormControl){
    const email = this.newReservationForm.get('email').value;
    const emailExists = this.usersList.some(user => user.email === email);

    return emailExists ? { 'emailAlreadyExists': true } : null;
  }

  calendarBack() {
    this.myCal.slidePrev();
  }

  calendarForward() {
    this.myCal.slideNext();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    console.log(
      'Event selected:' +
      event.startTime +
      '-' +
      event.endTime +
      ',' +
      event.title
    );
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onTimeSelected(ev) {
    let timeInfos:any[]=[];
    let time:Date = ev.selectedTime;
    
    timeInfos.push(time.toLocaleDateString());
    timeInfos.push(time.getDay());

    this.newReservation.date = timeInfos[0];
    this.newReservation.day = this.convertDays(timeInfos[1]).toString();

    console.log(
      'Selected time: ' +
      ev.selectedTime +
      ', hasEvents: ' +
      (ev.events !== undefined && ev.events.length !== 0) +
      ', disabled: ' +
      ev.disabled
    );
    
    this.checkReservation()
    
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

    console.log(
      'Selected time: ' +
      ev.selectedTime.toLocaleString() 
    );

    console.log(ev.events);
  }

  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }


  onRangeChanged(ev) {
    console.log(
      'range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime
    );
  }

  markDisabled = (date: Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return (
      date < current ||
      (date.getDay() !== this.insertDiasOpen[0] &&
        date.getDay() !== this.insertDiasOpen[1] &&
        date.getDay() !== this.insertDiasOpen[2] &&
        date.getDay() !== this.insertDiasOpen[3] &&
        date.getDay() !== this.insertDiasOpen[4] &&
        date.getDay() !== this.insertDiasOpen[5] &&
        date.getDay() !== this.insertDiasOpen[6])
    );
  };

  setDaysOpen() {
    if(this.selectedService.availableDays.length > 0 ){
      return this.selectedService.availableDays.forEach(el => {
        switch (el) {
          case "SUNDAY":
            this.insertDiasOpen.push(0);
            break;
          case "MONDAY":
            this.insertDiasOpen.push(1);
            break;
          case "TUESDAY":
            this.insertDiasOpen.push(2);
            break;
          case "WEDNESDAY":
            this.insertDiasOpen.push(3);
            break;
          case "THURSDAY":
            this.insertDiasOpen.push(4);
            break;
          case "FRIDAY":
            this.insertDiasOpen.push(5);
            break;
          case "SATURDAY":
            this.insertDiasOpen.push(6);
            break;
        }
        this.today();
      })
    }else{
      return "..."
    }
  }

  availableHours(data) {
    let horarioInicio = data.startTime;
    let horarioFinal = data.endTime;

    for (let i = parseInt(horarioInicio); i < parseInt(horarioFinal); i++) {
      if(i<10){
      this.horariosDisponiveis.push('0' + i + ':00h');
      this.horariosDisponiveis.push('0' + i + ':30h');
      }else{
        this.horariosDisponiveis.push(i + ':00h');
        this.horariosDisponiveis.push(i + ':30h');
      }
    }
  }

  loadOwnerInfos() {
    return this.userService.getUserById(this.serviceOwner).subscribe(
      data => {
        this.currentUserInfoName = data.name;
        this.currentUserInfoEmail = data.email;
        this.currentUserInfoPhone = data.phone;
        if(data.profilePicture.name !== null){
          this.profileImg = `/resource/pic/db/${data.profilePicture.name}`
        }
      }
    )
}

  loadServiceData(id){
    return this.servicesService.getServicesById(id).subscribe(
      data=>{
        this.selectedService = data[0];
        this.setDaysOpen()
        this.availableHours(this.selectedService);
        this.serviceName = this.selectedService.serviceName;
        this.criptoService.setItemToLocalStorage(JSON.stringify( data[0].reservations), 'reservas');
        this.reservationsData = JSON.parse(this.criptoService.getEncryptItem('reservas'));
        this.loadEventsOnCalendar();

        this.content=`Sua solicitação de reserva para ${this.selectedService.serviceName} da ${this.currentUserInfoName} foi realizada com sucesso. A confirmação da sua solicitação será encaminhada no e-mail fornecido, fique de olho para saber quando o Status da sua reserva for atualizado.`;
      }
    );
  }

  loadEventsOnCalendar() {
    let filtered = this.reservationsData;

    let event: any[] = [];

    filtered.map(el => {
      let startTime = el['startTime'];
      let endTime = el['endTime'];
      let ano = el['date'].substring(0,4);
      let mes = parseInt(el['date'].substring(5,7)) -1;
      let dia = el['date'].substring(8,10);
      
      let hour = startTime.split(':').slice(0,1).toString()
      let minute = startTime.split(':').slice(1,2).toString()

      let hour2 = endTime.split(':').slice(0,1).toString()
      let minute2 = endTime.split(':').slice(1,2).toString()

      let dataStart = new Date(Date.UTC(ano, mes, dia, parseInt(hour)+3, minute2 ))
      let dataEnd = new Date(Date.UTC(ano, mes, dia, parseInt(hour2)+3, minute ))

      let parseEvent: IEvent = {
        'id': el['reservationId'],
        'allDay': false,
        'startTime': dataStart,
        'endTime': dataEnd,
        'title': 'Horário indisponível',
        'category': el['status']
      }

      if(parseEvent.category !== "REJEITADO"){
        event.push(parseEvent);
      }

      return event;
    });

    this.eventSource = event;
  }

  convertDays(day:any){
    switch (day) {
      case 0:
        day = "Domingo";
        break;
      case 1:
        day = "Segunda-feira";
        break;
      case 2:
        day = "Terça-feira";
        break;
      case 3:
        day = "Quarta-feira";
        break;
      case 4:
        day = "Quinta-feira";
        break;
      case 5:
        day = "Sexta-feira";
        break;
      case 6:
        day = "Sábado";
        break;
    }
    return day;
  }

  setDaysToDatabase(day:any){
    switch (day) {
      case "Domingo":
        day = "SUNDAY";
        break;
      case "Segunda-feira":
        day = "MONDAY";
        break;
      case "Terça-feira":
        day = "TUESDAY";
        break;
      case "Quarta-feira":
        day = "WEDNESDAY";
        break;
      case "Quinta-feira":
        day = "THURSDAY";
        break;
      case "Sexta-feira":
        day = "FRIDAY";
        break;
      case "Sábado":
        day = "SATURDAY";
        break;
    }
    return day;
  }

  selectHour(ev){
    let hour = ev.target;
    let hourSelected:string = hour.innerText.replace('h', '').trim()+":00";
    this.newReservation.startTime =  hourSelected;
    this.newReservation.endTime =  this.setEndTime(hourSelected);
    
    this.checkReservation()
  }

  setEndTime(startTime){
    let timeToint = parseFloat(startTime.replace(":","."));
    let verify;

    if(timeToint + 1 <10){
      verify = '0'+ (timeToint + 1).toFixed(2).replace('.', ':')+"h" ;
    }else{
      verify = (timeToint + 1).toFixed(2).replace('.', ':')+"h" ;
    }
    
    if(this.horariosDisponiveis.includes(verify)){
      let endTime = (timeToint + 1).toFixed(2).replace('.', ':') + ":00";

      return endTime;
    } else{
      let lastHour = parseInt(this.horariosDisponiveis.slice(-1).toString().replace('h', '').replace(':','.')) + 1;

      return lastHour.toFixed(2).replace('.', ':') + ":00";
    }
  }

  checkReservation():void{
    if((this.newReservation.date && this.newReservation.startTime) !== undefined){
      this.isAllChecks = true;
    }else {
      this.isAllChecks = false;
    }
  }

  goToConfirm(){
    this.isNext = true;
    this.isOpenForm = true;
  }

  returnToReservation(){
    this.isNext = false;
    this.isOpenForm = false;
  }

  triggerClass(){
    if(this.isNext === true){
      return 'animation-out blocked';
    }else{
      return 'animation-reset'
    }
  }

  triggerForm(){
    if(this.isNext === true){
      return 'animation-out';
    }else{
      return 'animation-reset'
    }
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} caracteres restantes`;
  }

  onSubmit() {
    let phone:string = this.newReservationForm.value.phone;
    this.reservationUser.phone = phone.replace('(', '').replace(')', '').replace('-','').replace(' ', '').trim();

    let correctDate = this.newReservation.date.split('/').reverse().join('-');
    this.newReservation.date = correctDate;

    this.newReservation.day = this.setDaysToDatabase(this.newReservation.day);

    this.newReservation.user = this.reservationUser;
    if(this.comment.value === ''){
      this.newReservation.additionalInfo = null;
    }else this.newReservation.additionalInfo = this.comment.value;
    
    this.reservationService.insertNewReservation(this.serviceId, this.newReservation).subscribe(()=>{
    this.isReservationSend = true;
    });
  }
}