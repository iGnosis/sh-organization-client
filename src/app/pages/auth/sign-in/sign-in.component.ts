import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/services/auth/auth.service'
import { JwtService } from 'src/app/services/jwt/jwt.service'
import { UserService } from 'src/app/services/user/user.service'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  moduleId: 'sign-in.module'
})
export class SignInComponent implements OnInit {

  public email = ''
  public password = ''
  errors = []

  constructor(
    private router: Router,
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UserService) {
  }

  ngOnInit(): void {
  }

  async onSignIn() {
    this.router.navigate(['/public/auth/sms-login']);
  }

  next() {
    this.router.navigate(['/app/dashboard'])
  }

  forgotPassword() {
    this.router.navigate(['/public/auth/forgot-password'])
  }

}
