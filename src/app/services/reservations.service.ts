import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class ReservationsService {

  constructor(private httpClient: HttpClient) { }

  getReservationList(id:number):Observable<any>{
    return this.httpClient.get<any>(`/resource/services/${id}/reservations`);
  }

  insertNewReservation(id:number, body):Observable<any>{
    console.log(body);
    return this.httpClient.post<any>(`/resource/services/${id}/reservations`, body);
  }
}
