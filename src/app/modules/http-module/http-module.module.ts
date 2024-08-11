import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';



@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports:[
    HttpClientModule
  ],
  providers:[{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }]
})
export class HttpModuleModule { }
