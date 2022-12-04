import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, CanActivate } from '@angular/router';
import { JwtService } from '../services/jwt/jwt.service';

@Injectable()
export class InviteGuard implements CanActivate {
    constructor(private router: Router, private jwtService: JwtService) { }

    handleActivate(inviteCode: string) {
        if (this.jwtService.isAuthenticated()) {
            this.router.navigate(['/app/admin/add-organization', { inviteCode }]);
            return true
        } else {
            this.router.navigate(['/public/auth/sms-login', { inviteCode }]);
            return false
        }
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const inviteCode = route.paramMap.get('inviteCode') || '';
        return this.handleActivate(inviteCode)
    }
}
