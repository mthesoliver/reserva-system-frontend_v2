import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr);



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[
    IonicModule,
    CommonModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandler },
    { provide: LOCALE_ID, useValue: 'pt' },
  ],
})
export class SharedModule { }
