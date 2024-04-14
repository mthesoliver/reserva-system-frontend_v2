import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { OwnerInfoComponent } from '../admin-dashboard/components/owner-info/owner-info.component';
import { CalendarComponent, CalendarMode, NgCalendarModule, Step } from 'ionic2-calendar';
import { ServiceUpdate } from 'src/app/model/serviceUpdate';
import { UsersService } from 'src/app/services/users.service';
import { ResourceService } from 'src/app/services/resource.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesService } from 'src/app/services/services.service';
import { CreateServiceComponent } from './components/create-service/create-service.component';
import { Subscription } from 'rxjs';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-services-view',
  templateUrl: './services-view.page.html',
  styleUrls: ['./services-view.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    OwnerInfoComponent,
    NgCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    CreateServiceComponent
  ]
})
export class ServicesViewPage implements OnInit, OnDestroy {

  @ViewChild(CalendarComponent) myCal!: CalendarComponent;

  subService: Subscription;

  existentService: boolean;

  serviceUpdated: ServiceUpdate = new ServiceUpdate();
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

  serviceUpdateForm = this.fb.group({
    nome: [null, Validators.compose([
      Validators.required, Validators.minLength(3), Validators.maxLength(50)
    ])],
    startTime: [null, Validators.compose([
      Validators.required
    ])],
    endTime: [null, Validators.compose([
      Validators.required
    ])],
  });


  constructor(private activatedRoute : ActivatedRoute, private userService: UsersService, private resourceService: ResourceService, private fb: FormBuilder, private serviceServices: ServicesService, private router:Router) { }

  ngOnInit() {
    this.serviceUpdated.id = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));
    this.verifyIsserviceExists(this.serviceUpdated.id)

    this.subService =  this.resourceService.currentUser().subscribe(
      data => {

        this.userService.getUserById(data.id).subscribe(
          data => {

            data.services.forEach(el => {
              if (el.serviceId === parseInt(location.href.split('/').slice(-1).toString())) {
                this.actualService = el;

                this.setStartHour = parseInt(this.actualService['startTime']);
                this.setEndHour = parseInt(this.actualService['endTime']);

                this.setDaysOpen();
                this.availableHours(this.actualService)
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
      // date < current ||
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
    let checkbox = document.querySelectorAll('ion-checkbox')
    return this.actualService['availableDays'].forEach(el => {
      switch (el) {
        case "SUNDAY":
          this.diasOpen.push(0);
          checkbox[0].checked = true;
          break;
        case "MONDAY":
          this.diasOpen.push(1);
          checkbox[1].checked = true;
          break;
        case "TUESDAY":
          this.diasOpen.push(2);
          checkbox[2].checked = true;
          break;
        case "WEDNESDAY":
          this.diasOpen.push(3);
          checkbox[3].checked = true;
          break;
        case "THURSDAY":
          this.diasOpen.push(4);
          checkbox[4].checked = true;
          break;
        case "FRIDAY":
          this.diasOpen.push(5);
          checkbox[5].checked = true;
          break;
        case "SATURDAY":
          this.diasOpen.push(6);
          checkbox[6].checked = true;
          break;
      }
      this.today();
    });

  }

  activeCheckbox(event) {
    if (!event.checked && !event.value.includes(this.diasOpen)) {
      this.diasOpen.push(parseInt(event.value));
    } else if (event.checked || event.value.includes(this.diasOpen)) {
      const index = this.diasOpen.indexOf(parseInt(event.value));
      if (index > -1) {
        this.diasOpen.splice(index, 1);
      }
    } else {
      this.diasOpen.push(parseInt(event.value));
    }
    this.today();
  }

  onSubmit() {
    let diasDisponiveis = [];
    this.diasOpen.forEach(el => {
      switch (el) {
        case 0:
          diasDisponiveis.push("SUNDAY");
          break;
        case 1:
          diasDisponiveis.push("MONDAY");
          break;
        case 2:
          diasDisponiveis.push("TUESDAY");
          break;
        case 3:
          diasDisponiveis.push("WEDNESDAY");
          break;
        case 4:
          diasDisponiveis.push("THURSDAY");
          break;
        case 5:
          diasDisponiveis.push("FRIDAY");
          break;
        case 6:
          diasDisponiveis.push("SATURDAY");
          break;
      }
    })
    this.serviceUpdated.horarioInicio = this.serviceUpdateForm.value.startTime + ':00';
    this.serviceUpdated.horarioFinal = this.serviceUpdateForm.value.endTime + ':00';
    this.serviceUpdated.diasDisponiveis = diasDisponiveis;

    this.serviceServices.updateServiceById(this.serviceUpdated).subscribe();
    location.reload();
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
  }

  verifyIsserviceExists(id){
    if(parseInt(location.href.split('/').slice(-1).toString()) === id){
      this.existentService = true;
    }else{
      this.existentService = false;
    }
  }


  @ViewChild(IonModal) modal: IonModal;

  message = '';
  name: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  removeService() {
    this.serviceServices.removeService(this.actualService['serviceId']).subscribe();
    this.modal.dismiss(this.name, 'confirm');
    this.router.navigate(['admin/dashboard']);
  }

  onWillDismiss() {
    this.modal.dismiss();
  }

}
