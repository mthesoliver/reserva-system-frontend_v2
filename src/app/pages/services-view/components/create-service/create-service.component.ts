import { HttpErrorResponse } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarComponent, CalendarMode, NgCalendarModule, Step } from 'ionic2-calendar';
import { Subscription } from 'rxjs';
import { ServiceUpdate } from 'src/app/model/serviceUpdate';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { ConvertDaysService } from 'src/app/services/convert-days.service';
import { CriptoService } from 'src/app/services/cripto.service';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    NgCalendarModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CreateServiceComponent implements OnInit, OnDestroy {
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
      }
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


  constructor(private fb: FormBuilder, private serviceServices: ServicesService, private router: Router, private convertDays: ConvertDaysService, private criptoService: CriptoService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.newService.diasDisponiveis = [];
    this.setDaysOpen();
    this.newService.userId = parseInt(this.criptoService.getEncryptItem('userIdentification'));
  }

  ngOnDestroy(): void {
    this.newService = new ServiceUpdate;
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

  today() {
    this.calendar.currentDate = new Date();
  }

  markDisabled = (date: Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return (
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
    if (this.newService.diasDisponiveis.length <= 0) {
      this.convertDays.convertDaysOfDatabaseToIndex(this.newService.diasDisponiveis, this.insertDiasOpen, checkbox);
      this.today()
    } else {
      null
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
    this.convertDays.convertDaysOfIndexToDatabase(diasDisponiveis, this.insertDiasOpen);
    this.newService.horarioInicio = this.serviceUpdateForm.value.startTime + ':00';
    this.newService.horarioFinal = this.serviceUpdateForm.value.endTime + ':00';
    this.newService.diasDisponiveis = diasDisponiveis;

    this.serviceServices.insertNewService(this.newService).subscribe(()=>{
      this.loadingCtrl.dismiss()
      this.router.navigate(["admin/dashboard"]);
      }, (error:HttpErrorResponse)=>{
        this.loadingCtrl.dismiss()
        alert('Error: ' + error.status);
        this.router.navigate(["admin/dashboard"]);
      });
  }

}
