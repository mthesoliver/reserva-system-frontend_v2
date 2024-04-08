import { animation } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MaskitoDirective } from '@maskito/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { NgCalendarModule, CalendarComponent, CalendarMode, Step } from 'ionic2-calendar';
import { Subscription } from 'rxjs';
import { InsertReservation } from 'src/app/model/insertReservation';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { OwnerInfoComponent } from 'src/app/pages/admin-dashboard/components/owner-info/owner-info.component';
import { ReservationsService } from 'src/app/services/reservations.service';
import { ServicesService } from 'src/app/services/services.service';
import { UsersService } from 'src/app/services/users.service';

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
    MaskitoDirective
  ]
})
export class ServiceCalendarPage implements OnInit , OnDestroy {
  @ViewChild(CalendarComponent) myCal!: CalendarComponent;

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

  setStartHour: number = 0;
  setEndHour: number = 0;

  insertDiasOpen = [];
  horariosDisponiveis = [];

  isToday: boolean;
  isAllChecks:boolean = false;
  isNext: boolean = false;

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

  
  usersList: any[] = [];

  constructor(private activatedRoute:ActivatedRoute, private fb: FormBuilder, private userService:UsersService, private servicesService:ServicesService, private reservationService:ReservationsService) { }

  ngOnInit() {
    this.serviceId = this.activatedRoute.snapshot.paramMap.get('serviceId');
    this.serviceOwner = this.activatedRoute.snapshot.paramMap.get('name');
    this.subService = this.loadOwnerInfos();
    this.subSelectedService = this.loadServiceData(this.serviceId);

    this.userService.getUsersEmail().subscribe(users => {
      this.usersList = users; 
      this.newReservationForm.get('email').addValidators([this.emailExists.bind(this)]);
    });;
  }

  ngOnDestroy(): void {
    this.subService.unsubscribe();
    this.subSelectedService.unsubscribe();
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
      this.horariosDisponiveis.push(i + ':00h');
      this.horariosDisponiveis.push(i + ':30h');
    }
  }

  loadOwnerInfos() {
    return this.userService.getUserById(this.serviceOwner).subscribe(
      data => {
        this.currentUserInfoName = data.name;
        this.currentUserInfoEmail = data.email;
        this.currentUserInfoPhone = data.phone;
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
      }
    );
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

    let verify = (timeToint + 1).toFixed(2).replace('.', ':')+"h" ;
    
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
  }

  returnToReservation(){
    this.isNext = false;
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

  

  onSubmit() {
    let phone:string = this.newReservationForm.value.phone;
    this.reservationUser.phone = phone.replace('(', '').replace(')', '').replace('-','').replace(' ', '').trim();

    let correctDate = this.newReservation.date.split('/').reverse().join('-');
    this.newReservation.date = correctDate;

    this.newReservation.day = this.setDaysToDatabase(this.newReservation.day);

    this.newReservation.user = this.reservationUser;
    console.log(this.newReservation);
    this.reservationService.insertNewReservation(this.serviceId, this.newReservation).subscribe();
  }
}