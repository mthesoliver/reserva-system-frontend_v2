import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';

@Component({
  selector: 'app-return-page',
  templateUrl: './return-page.component.html',
  styleUrls: ['./return-page.component.scss'],
  standalone:true,
  imports:[
    SharedModule
  ]
})
export class ReturnPageComponent  implements OnInit {
  @Input()
  title:string='';
  @Input()
  content:string='';
  @Input()
  returnToPage:string='';
  constructor() { }

  ngOnInit() {}

}
