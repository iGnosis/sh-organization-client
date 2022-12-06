import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Observable, Subject } from 'rxjs';
import { JwtToken } from 'src/app/pointmotion';
import { UserRole } from '../auth/auth.enum';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private currentToken = new Subject<string>();
  private tokenSetInterval: any;

  constructor() {}

  watchToken(): Observable<any> {
    return this.currentToken.asObservable();
  }

  isAuthenticated() {
    const accessToken = this.getToken();

    if (!accessToken) {
      return false;
    }

    const decodedToken: JwtToken = jwtDecode(accessToken);

    const nowUnixEpochInSecs = new Date().getTime() / 1000;
    const diffInSecs = nowUnixEpochInSecs - decodedToken.exp;

    // token stays valid for 24hrs.
    if (diffInSecs >= 0) {
      return false;
    }

    return true;
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
  }

  setToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  getToken() {
    const token = localStorage.getItem('accessToken');
    return token;
  }

  getRole(): UserRole | void {
    if (!this.isAuthenticated()) {
      return
    }
    const token = this.getToken() || '';
    const decodedToken: JwtToken = jwtDecode(token);
    return decodedToken['https://hasura.io/jwt/claims']['x-hasura-default-role'];
  }
}
