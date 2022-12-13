import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRole } from '../pointmotion';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class DefaultRouteGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user = this.userService.get();
    let defaultRoute = 'app/dashboard'
    if (user && user.type && user.type === 'org_admin') {
      defaultRoute = 'app/admin'
    }
    console.log('default-route guard is running...')
    this.router.navigate([defaultRoute]);
    return true
  }

}
