import { Component, OnInit } from '@angular/core';
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
  serviceName: string;
  serviceId: number;
  userId: number;
  timeWork: string;

  constructor(private service: ServicesService, private resourceService: ResourceService, private userService: UsersService) {
  }

  ngOnInit() {
    
    this.resourceService.currentUser().subscribe(data => {
      this.userId = data.id

      this.userService.getUserById(this.userId).subscribe(
        data => {
          this.serviceId = data.services[0].serviceId;
          this.timeWork = `${(data.services[0].startTime).slice(0, 5)}h as ${(data.services[0].endTime).slice(0, 5)}h `;

          this.service.getServicesById(this.serviceId).subscribe(data => {
            this.serviceName = data[0].serviceName
          })
        }
      )
    })
  }

}
