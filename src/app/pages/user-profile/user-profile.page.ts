import { filter } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { OwnerInfoComponent } from '../admin-dashboard/components/owner-info/owner-info.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { UsersService } from 'src/app/services/users.service';
import { ResourceService } from 'src/app/services/resource.service';
import { MaskitoDirective } from '@maskito/angular';
import { UserUpdate } from 'src/app/model/userUpdate';
import { Subscription } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [SharedModule, OwnerInfoComponent, FormsModule,
    ReactiveFormsModule, MaskitoDirective]
})
export class UserProfilePage implements OnInit, OnDestroy {
  profileImg:string = 'https://blog.davidstea.com/en/wp-content/uploads/2018/04/Placeholder.jpg'
  subUser:Subscription

  enableButton:boolean = false;

  userId;
  userEmail:string;
  userName:string;
  userPhone:string;
  hasProfilePic:boolean;

  userUpdate:UserUpdate = new UserUpdate;

  registerForm = this.fb.group({
    nome: [null, Validators.compose([
      Validators.minLength(3), Validators.maxLength(50)
    ])],
    telefone: [null, Validators.compose([ 
      Validators.minLength(10)
    ])]
  });

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/,  '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(private fb: FormBuilder, private userService:UsersService, private resourceService:ResourceService, private imageService: ImageService) { }

  ngOnDestroy(): void {
    this.subUser.unsubscribe()
  }

  ngOnInit() {
    this.subUser = this.loadUserData()
  }

  loadUserData(){
    return this.resourceService.currentUser().subscribe(
      data=>{
        this.userId = data.id;
        this.userEmail = data.email;
        this.userName = data.name;
        this.userPhone = data.phone;
        if(data.getProfilePicture.name !== null){
          this.profileImg = `/resource/pic/db/${data.getProfilePicture.name}`
          this.hasProfilePic = true;
        }else{
          this.hasProfilePic = false;
        }
      })
  }

  updateImage(ev:any){
    this.imageService.uploadNewImage(ev.files[0], this.userId).subscribe();
    setTimeout(()=>{
      location.reload()
    },3000)
  }

  insertImage(ev:any){
    this.imageService.insertImage(ev.files[0], this.userId).subscribe();
    setTimeout(()=>{
      location.reload()
    },3000)
  }

  validRegisterForm():void{
    if(this.registerForm.value.nome !== '' || this.registerForm.value.telefone !== ''){
      this.enableButton = true;
    }else {
      this.enableButton = false;
    }
    console.log(this.userUpdate.nome);
  }

  onSubmit(){
      this.userUpdate.id = this.userId;
      this.userUpdate.email = this.userEmail;
      this.userUpdate.funcao = this.resourceService.getUserRoleToStorage();

      if(this.registerForm.value.telefone !== undefined){
        let phone:string = this.registerForm.value.telefone;
        this.userUpdate.telefone = phone.replace('(', '').replace(')', '').replace('-','').replace(' ', '').trim();
        }else{
          this.userUpdate.telefone = this.userPhone;
          console.log(this.userPhone);
        }

      if(this.registerForm.value.nome !== undefined){
        this.userUpdate.nome = this.registerForm.value.nome;
      }else{
        this.userUpdate.nome = this.userName;
        console.log(this.userName);
      }

      this.userService.updateUser(this.userUpdate).subscribe()
      location.reload();
  }

}
