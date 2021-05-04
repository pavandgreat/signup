import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

import { CookieService } from 'ngx-cookie';
import { HttpRequestService } from './http-request.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private cookieService: CookieService, private httpReq: HttpRequestService) { }

  public _isLogin: BehaviorSubject<any> = new BehaviorSubject(this.isCurrentUserExist());

  login(details: any): Observable<any>{    
    return this.httpReq.post('login', details);
  }

  signup(details: any){    
    return this.httpReq.post('signup', details);
  }

  logout(){
    this._isLogin.next(false);
    this.cookieService.removeAll();
  }

  isCurrentUserExist() {
      return !!this.httpReq.getCurrentUser();
  }

  storeCurrentUser(userData: any) {
    this.cookieService.put('userData', JSON.stringify(userData));
    this.storeLoginInCookies(userData.token);
  }

  storeLoginInCookies(token: string){
    this.cookieService.put('token', token);
  }
}