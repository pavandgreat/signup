import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';
import {BehaviorSubject} from "rxjs";
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})

export class HttpRequestService {
  public _isLoading: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  getCurrentUser() {
    const userData = this.cookieService.get('userData')

    if(userData) {
        return JSON.parse(userData);
    } else {
        return null;
    }
  }

  getHeaderOptions(opts: any) {
    const user = this.getCurrentUser();

    opts['headers'] = { 
      'Content-Type': 'application/json'
    }

    if(user) {
      opts['headers']['token'] = user.token;
    }

    return opts;
  }

  get(url: string, opts: any = {}){
    this._isLoading.next(true);
    const fullUrl = environment.baseURL + '/' + url;

    return this.http.get(fullUrl, this.getHeaderOptions(opts)).pipe(finalize(() => this._isLoading.next(false)));
  }

  post(url: string, data: any, opts: any = {}){
    this._isLoading.next(true);
    const fullUrl = environment.baseURL + '/' + url;

    return this.http.post(fullUrl, data, this.getHeaderOptions(opts)).pipe(finalize(() => this._isLoading.next(false)));
  }
}
