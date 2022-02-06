import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private jwt?: string
  private TOKEN = 'token'
  
  constructor() {
    this.jwt = localStorage.getItem(this.TOKEN) || ''
  }

  getToken(): string {
    return localStorage.getItem(this.TOKEN) || ''
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN, token)
  }
}
