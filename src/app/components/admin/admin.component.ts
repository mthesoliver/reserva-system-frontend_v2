import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { HttpModuleModule } from 'src/app/modules/http-module/http-module.module';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone:true,
  imports:[
    SharedModule,
    HttpModuleModule
  ],
})
export class AdminComponent  implements OnInit {

  message:string ='';
  msgAdmin ='';

  constructor(private resourceService: ResourceService) { }

  ngOnInit():void {
    this.resourceService.admin().subscribe(data =>{
      this.message = data.message;
    },
    err =>{
      console.log(err);
    });
  }

  admin():void{
    this.resourceService.admin().subscribe({
      next: (res: any) => (this.msgAdmin = res.message),
      error: (err: any) =>  (this.msgAdmin = err.statusText + ': ' + err.status)
    })
  }
}
