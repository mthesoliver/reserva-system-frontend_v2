import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports:[
    HttpClientModule
  ],
  providers:[
  ]
})
export class HttpModuleModule { }
