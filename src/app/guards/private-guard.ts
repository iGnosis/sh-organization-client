import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, CanActivate } from '@angular/router';
import { JwtService } from '../services/jwt/jwt.service';

@Injectable()
export class PrivateGuard implements CanActivateChild, CanActivate {
    constructor(private router: Router, private jwtService: JwtService) { }

    handleActivate() {
        if (this.jwtService.isAuthenticated()) {
            return true
        } else {
            this.router.navigate(['/public/auth/sign-in'])
            return false
        }
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.handleActivate()
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        return this.handleActivate()
    }
}
