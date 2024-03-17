import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuVisibilityService {
  private menuVisibilitySubject = new BehaviorSubject<boolean>(true);
  menuVisibility$ = this.menuVisibilitySubject.asObservable();

  constructor() { }

  
  setMenuVisibility(visibility: boolean) {
    this.menuVisibilitySubject.next(visibility);
  }
}
