import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@Directive({
  selector: '[acl]'
})
export class AccessControlDirective implements OnInit {
  @Input("navKey") navKey?: string;
  @Input("authKey") authKey?: string;

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    // console.log({ navKey: this.navKey, authKey: this.authKey })
    this.elementRef.nativeElement.style.display = "none";
    this.checkAccess();
  }

  checkAccess() {
    const currentUserRole = this.userService.get().type;
    // console.log('currentUserRole:', currentUserRole);

    const rbac = this.authService.getRbac();

    if (this.navKey) {
      rbac.uiRbac.navigationBar.forEach(nav => {
        if (this.navKey === nav.key && nav.access.includes(currentUserRole)) {
          this.elementRef.nativeElement.style.display = 'block';
        }
      })
    }

    if (this.authKey) {
      rbac.uiRbac.routes.forEach(route => {
        route.rules.forEach(rule => {
          if (this.authKey === rule.key && rule.access.includes(currentUserRole)) {
            this.elementRef.nativeElement.style.display = 'block';
          }
        })
      })
    }
  }
}
