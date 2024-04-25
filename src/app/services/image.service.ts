import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class ImageService {

  constructor(private httpClient: HttpClient) { 
  }

  insertImage(file:any, id:any):Observable<any>{
    const foto = file
    const formData = new FormData();
    formData.append('file', foto);
  
return this.httpClient.post<any>(`/resource/pic/db/upload/${id}`, formData);
}

  uploadNewImage(file:any, id:any):Observable<any>{
      const foto = file
      const formData = new FormData();
      formData.append('file', foto);
    
  return this.httpClient.put<any>(`/resource/pic/db/replace/${id}`, formData);
  }

}
