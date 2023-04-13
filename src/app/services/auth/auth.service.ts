import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HasuraRbac, Rbac } from 'src/app/pointmotion';
import { environment } from '../../../environments/environment'
import { GraphqlService } from '../graphql/graphql.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = ''
  private logoutTimer: any;
  private logoutInactivityDurationMins = 15;

  constructor(
    private http: HttpClient,
    private gqlService: GraphqlService,
    private router: Router,
  ) {
    this.baseURL = environment.servicesEndpoint
  }

  async initRbac() {
    const query = `query rbac {
      fetchUserRbac {
        data
      }
    }`
    const resp = await this.gqlService.gqlRequest(query);
    if (resp && resp.fetchUserRbac) {
      window.sessionStorage.setItem('rbac', JSON.stringify(resp.fetchUserRbac.data as HasuraRbac));
    }
  }

  async getRbac(): Promise<Rbac> {
    let rbac = window.sessionStorage.getItem('rbac');
    if (!rbac) {
      const resp = await this.initRbac();
      rbac = window.sessionStorage.getItem('rbac');
    }
    return rbac ? JSON.parse(rbac) : {};
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['/public/auth/sign-in'])
  }

  requestResetLink(email: string) {
    return this.http.post(this.baseURL+'/auth/request-password-reset-link', {email})
  }

  reset(code: string, password: string) {
    return this.http.post(this.baseURL+'/auth/reset-password', {code, password})
  }

  startLogoutTimer() {
    this.logoutTimer = setTimeout(() => {
      console.log('logging out due to inactivity');
      this.logout();
    }, this.logoutInactivityDurationMins * 60 * 1000);
  }

  resetLogoutTimer() {
    clearTimeout(this.logoutTimer);
    this.startLogoutTimer();
  }
}
