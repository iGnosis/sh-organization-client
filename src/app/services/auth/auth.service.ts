import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL: string = ''
  constructor(private http: HttpClient) {
    this.baseURL = environment.servicesEndpoint
  }

  login(details: any) {
    return this.http.post(this.baseURL+'/auth/login', details)
  }

  reset(code: string, password: string) {
    return this.http.post(this.baseURL+'/auth/reset-password', {code, password})
  }
}
