import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router,
  ) {}

  async ngOnInit() {
    // console.log({ nav: this.nav, feature: this.feature })
    this.elementRef.nativeElement.style.display = "none";
    await this.checkAccess();
  }

  async checkAccess() {
    const currentUserRole = this.userService.get().type;
    if (!currentUserRole) {
      window.localStorage.clear();
      this.router.navigate(['/']);
    }
    // console.log('currentUserRole:', currentUserRole);

    const rbac = await this.authService.getRbac();
    if (!rbac || !rbac.uiRbac || Object.keys(rbac.uiRbac).length === 0) return

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
