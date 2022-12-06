import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { JwtService } from '../jwt/jwt.service';
import { UserService } from '../user/user.service';
import { UserRole } from './auth.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseURL = ''
  rbacRules: { [key: string]: UserRole[] } = {}

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private userService: UserService
  ) {
    this.baseURL = environment.servicesEndpoint;
    this.rbacRules = this.userService.getRbacRules()
  }

  rbac(htmlElements: NodeList) {
    const userRole = this.jwtService.getRole()
    if (!userRole) return

    // console.log('userRole: ', userRole);
    // console.log('htmlElements: ', htmlElements);
    console.log('rbac:rules: ', this.rbacRules);

    // remove elements based on rules.
    htmlElements.forEach(ele => {
      const htmlEle = ele as HTMLElement;
      if (htmlEle && htmlEle.dataset && htmlEle.dataset['authKey']) {

        const authKey: string = htmlEle.dataset['authKey'];
        // console.log(authKey);

        const allowedRoles = this.rbacRules[authKey];
        // console.log(allowedRoles)

        if (allowedRoles && !allowedRoles.includes(userRole)) {
          (ele as HTMLElement).style.display = 'none';
        }
      }
    })
  }

  requestResetLink(email: string) {
    return this.http.post(this.baseURL+'/auth/request-password-reset-link', {email})
  }

  reset(code: string, password: string) {
    return this.http.post(this.baseURL+'/auth/reset-password', {code, password})
  }
}
