import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { JwtService } from 'src/app/services/jwt/jwt.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {

  code = ''
  password = ''
  confirmPassword = ''
  errors = []

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private router: Router, 
    private jwtService: JwtService,
    private userService: UserService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.code = params.get('code') || ''
      console.log(this.code)
    })
  }

  resetPassword() {
    this.errors = []
    this.authService.reset(this.code, this.password).subscribe((data:any) => {
      console.log(data);
      this.jwtService.setToken(data.token)
      this.userService.set(data.user)
      this.next()
    }, (error) => {
      this.errors = error.error.message
    })
  }

  next() {
    this.router.navigate(['/app/patients'])
  }
}
