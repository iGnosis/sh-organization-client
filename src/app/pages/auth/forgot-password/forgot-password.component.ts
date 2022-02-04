import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  email: string = ''
  showForgot: boolean = true
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  async onRequestPasswordResetLink() {

  }

  signIn() {
    this.router.navigate(['/public/auth/sign-in'])
  }

}
