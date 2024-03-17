import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'any'
})
export class UsersService {
  baseDados: any;
  private currentUser: any;

  constructor(private http: HttpClient) { }

  getUsersEmail():Observable<any>{
    return this.http.get<any[]>('/resource/users/email');
  }

}
