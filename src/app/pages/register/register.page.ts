import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { MaskitoDirective } from '@maskito/angular';
import { MenuVisibilityService } from 'src/app/services/menu-visibility.service';
import { HttpModuleModule } from 'src/app/modules/http-module/http-module.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    HttpModuleModule,
    FormsModule,
    ReactiveFormsModule,
    MaskitoDirective
  ]
})
export class RegisterPage implements OnInit {

  iconShow:string = '';
  passwordShow:string = '';
  usersList: any[] = [];

  registerForm = this.fb.group({
    nome: [null, Validators.compose([
      Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[A-z+a-z+/ /+/á-ú+Á-Ú/+/ãÃ+Â-Û/+/â-û+À-Ù/+/à-ù/]+$')
    ])],
    email: [null, Validators.compose([
      Validators.required, Validators.email
    ])],
    telefone: [null, Validators.compose([ 
      Validators.minLength(14)
    ])],
    senha:[null, Validators.compose([
      Validators.required, Validators.minLength(6)
    ])],
    confirmarSenha:[null, Validators.compose([
      Validators.required, Validators.minLength(6)
    ])]
  });

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/,  '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(private fb: FormBuilder, private menuVisibilityService: MenuVisibilityService, private userService:UsersService) {
    this.menuVisibilityService.setMenuVisibility(false);
  }

  ngOnInit() {
    this.registerForm.get('confirmarSenha').setValidators([this.passwordConfirmed.bind(this)]);
    this.iconShow = 'eye';
    this.passwordShow = 'password';

    this.userService.getUsersEmail().subscribe(users => {
      this.usersList = users; 
      console.log(this.usersList);
      this.registerForm.get('email').setValidators([this.emailExists.bind(this)]);
    });
  }

  passwordConfirmed(control: FormControl){
    const password = this.registerForm.get('senha').value;
    const passwordConfirmed = control.value;
    return  password === passwordConfirmed ? null : {'passwordNotMatch':true}
  }

  emailExists(control:FormControl){
    const email = this.registerForm.get('email').value;
    const emailExists = this.usersList.some(user => user.email === email);

    return emailExists ? { 'emailAlreadyExists': true } : null;
  }

  showPassword():void{
    if(this.iconShow ==='eye'){
      this.iconShow = 'eye-off'
      this.passwordShow = 'text';

    }else{
      this.iconShow  = 'eye';
      this.passwordShow = 'password';
    }
  }

}
