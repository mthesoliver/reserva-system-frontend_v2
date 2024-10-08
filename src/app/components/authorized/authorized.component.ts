import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor( private router: Router) { }

  ngOnInit():void {
    setTimeout(()=>{
      if(localStorage.getItem('role') === "ADMIN"){
        this.router.navigate(['/admin/dashboard']);
      }else{
        this.router.navigate(['home'])
      }
    },200)
  }

}
