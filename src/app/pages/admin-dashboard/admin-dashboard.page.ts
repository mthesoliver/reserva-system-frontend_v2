import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OwnerInfoComponent } from './components/owner-info/owner-info.component';
import { ResourceService } from 'src/app/services/resource.service';
import { ServicesBoardComponent } from './components/services-board/services-board.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ServicesService } from 'src/app/services/services.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OwnerInfoComponent,
    ServicesBoardComponent,
    ReservationListComponent
  ]
})
export class AdminDashboardPage implements OnInit {
  currentUserId: number;
  activeServices:any[] = [];

  constructor(private resourceService: ResourceService, private services: ServicesService, private userService: UsersService) { }

  ngOnInit() {
    this.resourceService.currentUser().subscribe(
      data => {
        this.currentUserId = data.id;

        this.userService.getUserById(this.currentUserId).subscribe(
          data=>{
            data.services.forEach(el => {
              this.activeServices.push(el)
              // let servicesBoards = document.createElement('app-services-board')
              // document.getElementById('services-boards').appendChild(servicesBoards)
            });

            console.log(this.activeServices)
          }
        )
      })

  }
}
