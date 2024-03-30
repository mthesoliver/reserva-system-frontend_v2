import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { ResourceService } from 'src/app/services/resource.service';
import { ServicesService } from 'src/app/services/services.service';
import { UsersService } from 'src/app/services/users.service';

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


  constructor(private router:Router
    //private service: ServicesService, private resourceService: ResourceService, private userService: UsersService
    ) {}

  ngOnInit() {
  }

  onClick(serviceId){
    this.router.navigate([`admin/services/${serviceId}`])
  }
}
