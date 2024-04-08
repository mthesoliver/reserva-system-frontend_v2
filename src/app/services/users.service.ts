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
    return this.http.post<User>('/resource/users/register', registerUser);
  }

  getUserById(id:any):Observable<any>{
    return this.http.get<any>(`/resource/users/${id}`).pipe(first());
  }

  updateUser(updatedUser):Observable<any>{
    return this.http.put<any>(`/resource/users`, updatedUser);
  }

}
