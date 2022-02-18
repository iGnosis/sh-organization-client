import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  email: string = ''
  showForgot: boolean = true
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  async onRequestPasswordResetLink() {
    console.log('requesting password link');
    
    await this.authService.requestResetLink(this.email).subscribe((data) => {
      this.showForgot = false
    })
  }

  signIn() {
    this.router.navigate(['/public/auth/sign-in'])
  }

}
