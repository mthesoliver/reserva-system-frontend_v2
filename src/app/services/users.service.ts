import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first} from 'rxjs';
import { User } from '../model/users';

@Injectable({
  providedIn: 'any'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsersEmail():Observable<any>{
    return this.http.get<any[]>('/resource/users/email');
  }

  postNewUser(registerUser):Observable<any>{
    console.log(registerUser);
    return this.http.post<User>('/resource/users/register', registerUser);
  }

  getUserById(id:number):Observable<any>{
    return this.http.get<any>(`/resource/users/${id}`).pipe(first());
  }

  // postWithCSRFToken(data: User): Observable<any> {
  //   const csrfToken = this.getCookie('XSRF-TOKEN');
  //   console.log(csrfToken);
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'X-XSRF-TOKEN': csrfToken
  //   });

  //   return this.http.post<User>('resource/users/register', data, {headers} );
  // }

  // private getCookie(name: string): string {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(';').shift();
  //   return '';
  // }

}
