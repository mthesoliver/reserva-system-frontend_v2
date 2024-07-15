import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { MaskitoDirective } from '@maskito/angular';
import { MenuVisibilityService } from 'src/app/services/menu-visibility.service';
import { HttpModuleModule } from 'src/app/modules/http-module/http-module.module';
import { User } from 'src/app/model/users';
import { Router } from '@angular/router';
import { Power4, gsap } from 'gsap';
import { ReturnPageComponent } from 'src/app/components/return-page/return-page.component';

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
    MaskitoDirective,
    ReturnPageComponent
  ]
})
export class RegisterPage implements OnInit {

  title:string = "Cadastro feito com sucesso!";
  content:string = "Para finalizar o seu cadastro verifique seu e-mail para poder fazer a confirmação.";
  isRegistrationSend:boolean=false;
  backToLogin:string = "http://127.0.0.1:9000/login";
  isBgDark:boolean=true;

  iconShow:string = '';
  passwordShow:string = '';
  usersList: any[] = [];
  newUserRegister:User = new User;

  registerForm = this.fb.group({
    nome: [null, Validators.compose([
      Validators.required, Validators.minLength(3), Validators.maxLength(50)
    ])],
    email: [null, Validators.compose([
      Validators.required, Validators.email
    ])],
    telefone: [null, Validators.compose([ 
      Validators.minLength(10)
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

  constructor(private fb: FormBuilder, private menuVisibilityService: MenuVisibilityService, private userService:UsersService, private router: Router) {
    this.menuVisibilityService.setMenuVisibility(false);
  }
  

  ngOnInit() {
    this.iconShow = 'eye';
    this.passwordShow = 'password';
    this.registerForm.get('confirmarSenha').addValidators([this.passwordConfirmed.bind(this)]);

    this.userService.getUsersEmail().subscribe(users => {
      this.usersList = users; 
      this.registerForm.get('email').addValidators([this.emailExists.bind(this)]);
    });

    
      const bg_parallax = document.getElementsByClassName("login-container"); 
      Array.prototype.forEach.call(bg_parallax, (el: HTMLElement) => {
        let bgPos = {
          x: 50,
          y: 50
        };
  
        const delta = -0.05;
        const reactToTweenUpdate = () => {
          let winW = window.innerWidth / 2;
          let winH = window.innerHeight / 2;
          el.style.backgroundPosition = `${50 - (bgPos.x - winW) * delta}% ${50 - (bgPos.y - winH) * delta}%`;
        };
  
        let tween = gsap.to(bgPos,{
          onUpdate: () => reactToTweenUpdate(),
          ease:Power4.easeOut,
        }).duration(1);
  
        el.onmousemove = (event) => {
          gsap.to(bgPos,{
            x:event.clientX ,
            y:event.clientY ,
            ease:Power4.easeOut
          }).duration(1);
          
          tween.restart();
        };
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


  onSubmit(){
    if(this.registerForm.value.telefone !== null){
    let phone:string = this.registerForm.value.telefone;
    this.newUserRegister.telefone = phone.replace('(', '').replace(')', '').replace('-','').replace(' ', '').trim();
    }
    this.newUserRegister.funcao='ADMIN';
    this.userService.postNewUser(this.newUserRegister).subscribe(data=>{
      this.isRegistrationSend = true;
      this.isBgDark=false;
    });
  }

}
