import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/common-module/shared';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { UsersService } from 'src/app/services/users.service';
import { MaskitoDirective } from '@maskito/angular';
import { UserUpdate } from 'src/app/model/userUpdate';
import { ImageService } from 'src/app/services/image.service';
import { CriptoService } from 'src/app/services/cripto.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [SharedModule, FormsModule,
    ReactiveFormsModule, MaskitoDirective]
})
export class UserProfilePage implements OnInit {
  profileImg: string = 'https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg'

  enableButton: boolean = false;

  currentUser: any;
  userId;
  userEmail: string;
  userName: string;
  userPhone: string;
  hasProfilePic: boolean;

  userUpdate: UserUpdate = new UserUpdate;

  registerForm = this.fb.group({
    nome: [null, Validators.compose([
      Validators.minLength(3), Validators.maxLength(50)
    ])],
    telefone: [null, Validators.compose([
      Validators.minLength(10)
    ])]
  });

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(private fb: FormBuilder, private userService: UsersService, private imageService: ImageService, private criptoService: CriptoService) { }

  ngOnInit() {
    this.loadUserData()
  }

  loadUserData() {
    this.currentUser = JSON.parse(this.criptoService.getEncryptItem('currentUser'));

    this.userId = this.currentUser.id;
    this.userEmail = this.currentUser.email;
    this.userName = this.currentUser.name;
    this.userPhone = this.currentUser.phone;

    if (this.currentUser.getProfilePicture !== null) {
      this.profileImg = this.criptoService.getEncryptItem('userProfilePicture')
      this.hasProfilePic = true;
    } else {
      this.hasProfilePic = false;
    }
  }

  updateImage(ev: any) {
    this.imageService.uploadNewImage(ev.files[0], this.userId).subscribe();
    setTimeout(() => {
      location.reload()
    }, 2000)
  }

  insertImage(ev: any) {
    this.imageService.insertImage(ev.files[0], this.userId).subscribe();
    setTimeout(() => {
      location.reload()
    }, 2000)
  }

  validRegisterForm(): void {
    if (this.registerForm.value.nome !== '' || this.registerForm.value.telefone !== '') {
      this.enableButton = true;
    } else {
      this.enableButton = false;
    }
  }

  onSubmit() {
    this.userUpdate.id = this.userId;
    this.userUpdate.email = this.userEmail;
    this.userUpdate.funcao = localStorage.getItem('role');

    if (this.registerForm.value.telefone !== undefined) {
      let phone: string = this.registerForm.value.telefone;
      this.userUpdate.telefone = phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '').trim();
    } else {
      this.userUpdate.telefone = this.userPhone;
      console.log(this.userPhone);
    }

    if (this.registerForm.value.nome !== undefined) {
      this.userUpdate.nome = this.registerForm.value.nome;
    } else {
      this.userUpdate.nome = this.userName;
      console.log(this.userName);
    }

    this.userService.updateUser(this.userUpdate).subscribe()
    location.reload();
  }

}
