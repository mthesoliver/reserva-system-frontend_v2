import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CriptoService {

  constructor() { }

  setItemToLocalStorage(item:any, keyName:string):void{
    localStorage.removeItem(keyName);
    this.setEncryptItem(item, keyName);
  }

  getEncryptItem(keyName:string):string{
    const encrypted = localStorage.getItem(keyName);
    const decrypted = CryptoJS.AES.decrypt(encrypted, environment.secret_pkce).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }

  private setEncryptItem(item:any, keyName:string):void{
    const encrypted = CryptoJS.AES.encrypt(item, environment.secret_pkce);
    localStorage.setItem(keyName, encrypted.toString());
  }
}
