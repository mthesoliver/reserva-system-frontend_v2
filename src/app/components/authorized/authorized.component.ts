import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { HttpModuleModule } from 'src/app/modules/http-module/http-module.module';

@Component({
  selector: 'app-authorized',
  templateUrl: './authorized.component.html',
  styleUrls: ['./authorized.component.scss'],
  standalone:true,
  imports: [SharedModule,HttpModuleModule],
})
export class AuthorizedComponent  implements OnInit {
  code! :string;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit():void {
    alert('break')
    location.href='/login/oauth2/code/gateway'
  }

}
