import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class ServicesService {

  constructor(private httpClient: HttpClient) { }

  getServices(): Observable<any> {
    return this.httpClient.get<any>('/resource/services')
  }

  getServicesById(id: any): Observable<any> {
    return this.httpClient.get<any>(`/resource/services/${id}`)
  }

  updateServiceById(updatedService):Observable<any>{
    return this.httpClient.put<any>(`resource/services`, updatedService)
  }
}
