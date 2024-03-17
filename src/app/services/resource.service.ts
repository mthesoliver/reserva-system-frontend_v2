import { Observable, first } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'any'
})
export class ResourceService {

  resourceUrl = environment.resource_url;

  constructor(private httpClient: HttpClient) { }

  public user() :Observable<any>{
    return this.httpClient.get<any>(this.resourceUrl + 'user');
  }

  public admin() :Observable<any>{
    return this.httpClient.get<any>(this.resourceUrl + 'admin');
  }

  public userTwo(): Observable<any>{
    return this.httpClient.get<any>('/resource/user')
  }

  public adminTwo(): Observable<any>{
    return this.httpClient.get<any>('/resource/admin')
  }

  public logged():Observable<any>{
    return this.httpClient.get<any>('/resource/logged').pipe(first());
  }
}
