import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarComponent, CalendarMode, NgCalendarModule, Step } from 'ionic2-calendar';
import { Subscription } from 'rxjs';
import { ServiceUpdate } from 'src/app/model/serviceUpdate';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { ResourceService } from 'src/app/services/resource.service';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss'],
  standalone:true,
  imports:[
    SharedModule, 
    NgCalendarModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CreateServiceComponent  implements OnInit, OnDestroy {
  @ViewChild(CalendarComponent) myCal!: CalendarComponent;

  newService: ServiceUpdate = new ServiceUpdate();
  subService: Subscription;

  viewTitle;

  setStartHour: number = 0;
  setEndHour: number = 0;

  insertDiasOpen = [];
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


  constructor(private resourceService: ResourceService, private fb: FormBuilder, private serviceServices: ServicesService, private router:Router) { }

  ngOnInit() {
    this.newService.diasDisponiveis =[];
    this.setDaysOpen() 
    this.availableHours(this.newService) 

    this.subService = this.resourceService.currentUser().subscribe(
      data => {
        this.newService.userId = data.id;
      })
  }

  ngOnDestroy(): void {
    this.subService.unsubscribe();
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
    let checkbox = document.querySelectorAll('ion-checkbox')
    
    if(this.newService.diasDisponiveis.length <=0 ){
      return this.newService.diasDisponiveis.forEach(el => {
        switch (el) {
          case "SUNDAY":
            this.insertDiasOpen.push(0);
            checkbox[0].checked = true;
            break;
          case "MONDAY":
            this.insertDiasOpen.push(1);
            checkbox[1].checked = true;
            break;
          case "TUESDAY":
            this.insertDiasOpen.push(2);
            checkbox[2].checked = true;
            break;
          case "WEDNESDAY":
            this.insertDiasOpen.push(3);
            checkbox[3].checked = true;
            break;
          case "THURSDAY":
            this.insertDiasOpen.push(4);
            checkbox[4].checked = true;
            break;
          case "FRIDAY":
            this.insertDiasOpen.push(5);
            checkbox[5].checked = true;
            break;
          case "SATURDAY":
            this.insertDiasOpen.push(6);
            checkbox[6].checked = true;
            break;
        }
        this.today();
      })
    }else{
      return "..."
    }
  }

  activeCheckbox(event) {
    if (!event.checked && !event.value.includes(this.insertDiasOpen)) {
      this.insertDiasOpen.push(parseInt(event.value));
    } else if (event.checked) {
      const index = this.insertDiasOpen.indexOf(parseInt(event.value));
      if (index > -1) {
        this.insertDiasOpen.splice(index, 1);
      }
    } else {
      this.insertDiasOpen.push(parseInt(event.value));
    }
    
    this.today();
  }

  onSubmit() {
    let diasDisponiveis = [];
    this.insertDiasOpen.forEach(el => {
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
    this.newService.horarioInicio = this.serviceUpdateForm.value.startTime + ':00';
    this.newService.horarioFinal = this.serviceUpdateForm.value.endTime + ':00';
    this.newService.diasDisponiveis = diasDisponiveis;

    this.serviceServices.insertNewService(this.newService).subscribe();
    this.router.navigate(['admin/dashboard'])
  }

  availableHours(data) {
    let horarioInicio = data.horarioInicio;
    let horarioFinal = data.horarioFinal;

    for (let i = parseInt(horarioInicio); i < parseInt(horarioFinal); i++) {
      this.horariosDisponiveis.push(i + ':00h');
      this.horariosDisponiveis.push(i + ':30h');
    }
  }

}
