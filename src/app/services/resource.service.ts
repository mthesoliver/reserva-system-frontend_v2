import { Observable, first } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'any'
})
export class ResourceService {

  private resourceUrl = environment.resource_url;

  constructor(private httpClient: HttpClient) { }

  public user() :Observable<any>{
    return this.httpClient.get<any>(this.resourceUrl + 'user');
  }

  public admin() :Observable<any>{
    return this.httpClient.get<any>(this.resourceUrl + 'admin');
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

  public getUserRoleToStorage(){
    localStorage.getItem('role');
  }

  public clearUserRoleToStorage(){
    localStorage.removeItem('role');
  }
}
