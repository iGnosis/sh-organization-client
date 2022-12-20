import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';
import { UserRole } from '../users.enum';

@Injectable({
  providedIn: 'root'
})
export class DefaultRouteGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user = this.userService.get();
    const defaultRoute = this.userService.getDefaultRoute(user.type);
    this.router.navigate([defaultRoute]);
    return true
  }

}
