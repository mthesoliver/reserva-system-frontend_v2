import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent  implements OnInit {

  constructor(private router: Router, private resourceService: ResourceService) { }

  ngOnInit() {
    this.resourceService.clearUserRoleToStorage();
    this.resourceService.clearServiceIdToStorage();
    this.router.navigate(['login'])
  }

}
