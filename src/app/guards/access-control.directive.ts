import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@Directive({
  selector: '[acl]'
})
export class AccessControlDirective implements OnInit {
  @Input("nav") nav?: string;
  @Input("feature") feature?: string;

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    // console.log({ nav: this.nav, feature: this.feature })
    this.elementRef.nativeElement.style.display = "none";
    this.checkAccess();
  }

  checkAccess() {
    const currentUserRole = this.userService.get().type;
    // console.log('currentUserRole:', currentUserRole);

    const rbac = this.authService.getRbac();

    if (this.nav) {
      rbac.uiRbac.navigationBar.forEach(nav => {
        if (this.nav === nav.key && nav.access.includes(currentUserRole)) {
          this.elementRef.nativeElement.style.display = 'block';
        }
      })
    }

    if (this.feature) {
      rbac.uiRbac.routes.forEach(route => {
        route.rules.forEach(rule => {
          if (this.feature === rule.key && rule.access.includes(currentUserRole)) {
            this.elementRef.nativeElement.style.display = 'block';
          }
        })
      })
    }
  }
}
