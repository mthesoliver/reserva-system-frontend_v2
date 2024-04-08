import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { OwnerInfoComponent } from '../admin-dashboard/components/owner-info/owner-info.component';
import { CalendarComponent, CalendarMode, NgCalendarModule, Step } from 'ionic2-calendar';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { ResourceService } from 'src/app/services/resource.service';
import { ServicesService } from 'src/app/services/services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationListComponent } from '../admin-dashboard/components/reservation-list/reservation-list.component';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.page.html',
  styleUrls: ['./service-details.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    OwnerInfoComponent,
    NgCalendarModule,
    ReservationListComponent
  ]
})
export class ServiceDetailsPage implements OnInit , OnDestroy {

  @ViewChild(CalendarComponent) myCal!: CalendarComponent;

  subService: Subscription;
  serviceId:any;

  existentService: boolean;
  
  actualService = {}

  eventSource;
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


  constructor(private activatedRoute : ActivatedRoute,private userService: UsersService, private resourceService: ResourceService, private serviceServices: ServicesService, private router:Router) { }

  ngOnInit() {
    this.serviceId = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));
    
    this.subService = this.resourceService.currentUser().subscribe(
      data => {
        this.userService.getUserById(data.id).subscribe(
          data => {

            data.services.forEach(el => {
              if (el.serviceId === parseInt(location.href.split('/').slice(-1).toString())) {
                this.actualService = el;

                this.setStartHour = parseInt(this.actualService['startTime']);
                this.setEndHour = parseInt(this.actualService['endTime']);

                this.availableHours(this.actualService)
                this.setDaysOpen();
              }
            })
          }
        )
      })
  }

  ngOnDestroy(): void {
    this.existentService = false;
    this.subService.unsubscribe();
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
    console.log(
      'Selected time: ' +
      ev.selectedTime +
      ', hasEvents: ' +
      (ev.events !== undefined && ev.events.length !== 0) +
      ', disabled: ' +
      ev.disabled
    );
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
      (date.getDay() !== this.diasOpen[0] &&
        date.getDay() !== this.diasOpen[1] &&
        date.getDay() !== this.diasOpen[2] &&
        date.getDay() !== this.diasOpen[3] &&
        date.getDay() !== this.diasOpen[4] &&
        date.getDay() !== this.diasOpen[5] &&
        date.getDay() !== this.diasOpen[6])
    );
  };

  setDaysOpen() {
    return this.actualService['availableDays'].forEach(el => {
      switch (el) {
        case "SUNDAY":
          this.diasOpen.push(0);
          break;
        case "MONDAY":
          this.diasOpen.push(1);
          break;
        case "TUESDAY":
          this.diasOpen.push(2);
          break;
        case "WEDNESDAY":
          this.diasOpen.push(3);
          break;
        case "THURSDAY":
          this.diasOpen.push(4);
          break;
        case "FRIDAY":
          this.diasOpen.push(5);
          break;
        case "SATURDAY":
          this.diasOpen.push(6);
          break;
      }
      this.today();
    });

  }


  availableHours(data) {
    let horarioInicio = data.startTime.slice(0, 5);
    let horarioFinal = data.endTime.slice(0, 5);

    for (let i = parseInt(horarioInicio); i < parseInt(horarioFinal); i++) {
      this.horariosDisponiveis.push(i + ':00h');
      this.horariosDisponiveis.push(i + ':30h');
    }
  }

  verifyIsserviceExists(id){
    if(parseInt(location.href.split('/').slice(-1).toString()) === id){
      this.existentService = true;
    }else{
      this.existentService = false;
    }
  }

}
