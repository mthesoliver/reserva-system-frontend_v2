import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { CalendarComponent, CalendarMode, NgCalendarModule, Step } from 'ionic2-calendar';
import { ServiceUpdate } from 'src/app/model/serviceUpdate';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesService } from 'src/app/services/services.service';
import { CreateServiceComponent } from './components/create-service/create-service.component';
import { Subscription } from 'rxjs';
import { IonModal } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CriptoService } from 'src/app/services/cripto.service';
import { ConvertDaysService } from 'src/app/services/convert-days.service';

@Component({
  selector: 'app-services-view',
  templateUrl: './services-view.page.html',
  styleUrls: ['./services-view.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    NgCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    CreateServiceComponent
  ]
})
export class ServicesViewPage implements OnInit, OnDestroy, ViewWillLeave, ViewWillEnter {

  @ViewChild(CalendarComponent) myCal!: CalendarComponent;
  @ViewChild(IonModal) modal: IonModal;

  subService: Subscription;

  existentService: boolean;

  serviceUpdated: ServiceUpdate = new ServiceUpdate();
  actualService = {}
  viewTitle;
  bgTitle:string ="Editar Serviço";

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
    },
  };

  serviceUpdateForm = this.fb.group({
    nome: [null, Validators.compose([
      Validators.minLength(3), Validators.maxLength(50)
    ])],
    startTime: [null, Validators.compose([
      Validators.minLength(3)
    ])],
    endTime: [null, Validators.compose([
      Validators.minLength(3)
    ])],
  });


  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private serviceServices: ServicesService, private router: Router, private criptoService: CriptoService, private convertDays:ConvertDaysService) { }

  ionViewWillEnter(): void {
    this.subService = this.loadService();
    this.verifyIfServiceExists(this.serviceUpdated.id)
  }
  
  ionViewWillLeave(): void {
    this.existentService = false;
    this.subService.unsubscribe();
  }

  ngOnInit() {
    this.serviceUpdated.id = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));
    this.verifyIfServiceExists(this.serviceUpdated.id)
  }

  ngOnDestroy(): void {
    this.existentService = false;
    this.subService.unsubscribe();
  }

  loadService() {
  return this.serviceServices.getServicesByOwner(JSON.parse(this.criptoService.getEncryptItem('userIdentification'))).subscribe(data => {
      data.forEach(el => {
        if (el.serviceId === parseInt(location.href.split('/').slice(-1).toString())) {
          this.actualService = el;
          this.setStartHour = parseInt(this.actualService['startTime']);
          this.setEndHour = parseInt(this.actualService['endTime']);
          this.setDaysOpen(this.actualService['availableDays']);
          this.availableHours(this.actualService);
        }
      });
    })
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
      (date.getDay() !== this.diasOpen[0] &&
        date.getDay() !== this.diasOpen[1] &&
        date.getDay() !== this.diasOpen[2] &&
        date.getDay() !== this.diasOpen[3] &&
        date.getDay() !== this.diasOpen[4] &&
        date.getDay() !== this.diasOpen[5] &&
        date.getDay() !== this.diasOpen[6])
    );
  };

  setDaysOpen(service:any[]) {
    let checkbox = document.querySelectorAll('ion-checkbox')
    this.convertDays.convertDaysOfDatabaseToIndex(service, this.diasOpen, checkbox);
    this.today()
  }

  activeCheckbox(event) {
    if (!event.checked && !event.value.includes(this.diasOpen) || this.diasOpen.length === 0) {
      this.diasOpen.push(parseInt(event.value));
    } else if (event.checked || event.value.includes(this.diasOpen)) {
      const index = this.diasOpen.indexOf(parseInt(event.value));
      if (index > -1) {
        this.diasOpen.splice(index, 1);
      }
    }else {
      this.diasOpen.push(parseInt(event.value));
    }
    this.today();
  }

  onSubmit() {
    let diasDisponiveis = [];
    this.convertDays.convertDaysOfIndexToDatabase(diasDisponiveis, this.diasOpen);    
    this.serviceUpdateForm.value.startTime === undefined? this.serviceUpdated.horarioInicio = this.actualService['startTime'] :this.serviceUpdated.horarioInicio = this.serviceUpdateForm.value.startTime + ':00';
    this.serviceUpdateForm.value.endTime === undefined?  this.serviceUpdated.horarioFinal = this.actualService['endTime'] : this.serviceUpdated.horarioFinal = this.serviceUpdateForm.value.endTime + ':00';
    this.serviceUpdateForm.value.nome === undefined? this.serviceUpdated.nomeServico = this.actualService['serviceName']: this.serviceUpdated.nomeServico = this.serviceUpdateForm.value.nome;
    this.serviceUpdated.diasDisponiveis === this.actualService['availableDays']?  this.serviceUpdated.diasDisponiveis = this.actualService['availableDays']:this.serviceUpdated.diasDisponiveis = diasDisponiveis;

    this.serviceUpdated.userId = parseInt(this.criptoService.getEncryptItem('userIdentification'));
    this.serviceServices.updateServiceById(this.serviceUpdated).subscribe();
    location.reload();
  }

  availableHours(data) {
    let horarioInicio = data.startTime.slice(0, 5);
    let horarioFinal = data.endTime.slice(0, 5);

    for (let i = parseInt(horarioInicio); i < parseInt(horarioFinal); i++) {
      if (i < 10) {
        this.horariosDisponiveis.push('0' + i + ':00h');
        this.horariosDisponiveis.push('0' + i + ':30h');
      } else {
        this.horariosDisponiveis.push(i + ':00h');
        this.horariosDisponiveis.push(i + ':30h');
      }
    }
  }

  verifyIfServiceExists(id) {
    if (parseInt(location.href.split('/').slice(-1).toString()) === id) {
      this.existentService = true;
    } else {
      this.bgTitle = "Adicionar novo serviço"
      this.existentService = false;
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  removeService() {
    this.serviceServices.removeService(this.actualService['serviceId']).subscribe();
    this.modal.dismiss();
    this.router.navigate(['admin/dashboard']);
  }

  onWillDismiss() {
    this.modal.dismiss();
  }

}
