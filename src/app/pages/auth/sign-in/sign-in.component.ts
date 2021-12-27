import { Component, OnInit } from '@angular/core'
import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
} from 'amazon-cognito-identity-js'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor() { 
  }

  ngOnInit(): void {
  }

  async onSignIn() {
    
  }

}
