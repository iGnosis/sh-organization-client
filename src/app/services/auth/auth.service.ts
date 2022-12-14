import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HasuraRbac, Rbac } from 'src/app/pointmotion';
import { environment } from '../../../environments/environment'
import { GraphqlService } from '../graphql/graphql.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = ''
  constructor(private http: HttpClient, private gqlService: GraphqlService) {
    this.baseURL = environment.servicesEndpoint
  }

  async initRbac() {
    const query = `query rbac {
      fetchUserRbac {
        data
      }
    }`
    const resp = await this.gqlService.gqlRequest(query);
    window.sessionStorage.setItem('rbac', JSON.stringify(resp.fetchUserRbac.data as HasuraRbac));
  }

  getRbac(): Rbac {
    const rbac = window.sessionStorage.getItem('rbac');
    return rbac ? JSON.parse(rbac) : {}
  }

  requestResetLink(email: string) {
    return this.http.post(this.baseURL+'/auth/request-password-reset-link', {email})
  }

  reset(code: string, password: string) {
    return this.http.post(this.baseURL+'/auth/reset-password', {code, password})
  }
}
