import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/modules/common-module/shared';

@Component({
  selector: 'app-services-board',
  templateUrl: './services-board.component.html',
  styleUrls: ['./services-board.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class ServicesBoardComponent implements OnInit {
  
  @Input()
  serviceName: string;
  @Input()
  serviceId: string;
  @Input()
  userId: number;
  @Input()
  timeWork: string;

  isAdmin:boolean


  constructor(private router:Router) {}

  ngOnInit() {
    if(localStorage.getItem('role') === "ADMIN"){
      this.isAdmin = true
    }
  }

  onClick(){
    this.router.navigate(['admin/services', this.serviceId]);
  }

  toDetails(){
    this.router.navigate(['admin/services/details', this.serviceId])
  }

  goToCalendar(){
    this.router.navigate([`page/${location.href.split('/').slice(-1).toString()}/${this.serviceId}`]);
  }
}
