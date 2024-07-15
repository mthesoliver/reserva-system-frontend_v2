import { CriptoService } from './cripto.service';
import { Observable, first } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'any'
})
export class ResourceService {

  constructor(private httpClient: HttpClient) { }

  public user() :Observable<any>{
    return this.httpClient.get<any>('/resource/user');
  }

  public admin() :Observable<any>{
    return this.httpClient.get<any>('/resource/admin');
  }

  public logged():Observable<any>{
    return this.httpClient.get<any>('/resource/logged').pipe(first());
  }

  public currentUser():Observable<any>{
    return this.httpClient.get<any>('/resource/currentUser').pipe(first());
  }

  public setUserRoleToStorage(role){
    localStorage.setItem('role', role);
  }

  public setServiceIdToStorage(id){
    localStorage.setItem('serviceId', id);
  }

  public getUserRoleToStorage(){
    return localStorage.getItem('role');
  }

  public getServiceIdToStorage(){
    return localStorage.getItem('serviceId');
  }

  public clearUserRoleToStorage(){
    localStorage.removeItem('role');
  }

  public clearServiceIdToStorage(){
    localStorage.removeItem('serviceId');
  }
}
