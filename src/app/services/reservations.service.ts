import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class ReservationsService {

  constructor(private httpClient: HttpClient) { }

  getReservationList(id:any):Observable<any>{
    return this.httpClient.get<any>(`/resource/services/${id}/reservations`);
  }

  insertNewReservation(id:number, body):Observable<any>{
    return this.httpClient.post<any>(`/resource/services/${id}/reservations`, body);
  }

  getReservationsByDate(id:any, date:any){
    return this.httpClient.get<any>(`/resource/services/${id}/${date}/reservations`);
  }

  getReservationsByStatusAguardando(id:any):Observable<any>{
    return this.httpClient.get<any>(`/resource/services/${id}/reservations/aguardando`)
  }

  updateReservation(serviceId:number, reservationId: number, body): Observable<any> {
    return this.httpClient.put<any>(`/resource/services/${serviceId}/reservations/${reservationId}`, body);
  }

  deleteReservationById(serviceId:number, reservationId: number){
    return this.httpClient.delete<any>(`/resource/services/${serviceId}/reservations/${reservationId}`);
  }
}
