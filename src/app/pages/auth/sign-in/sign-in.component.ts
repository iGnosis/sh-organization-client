import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants'
import { GraphqlService } from 'src/app/services/graphql/graphql.service'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  moduleId: 'sign-in.module'
})
export class SignInComponent implements OnInit {

  public email = ''
  public password = ''
  error: any = {}

  constructor(private router: Router) { 
  }

  ngOnInit(): void {
  }

  async onSignIn() {
    const result = await GraphqlService.client.request(GqlConstants.SEARCH_USER, {username: this.email, password: this.password})
    if(result && Array.isArray(result.user)) {
      if(result.user.length == 0) {
        this.error.noUserFound = true
      } else {
        this.error.noUserFound = false
        this.next()
      }
    }else {
      this.error.noUserFound = true;
    }
    console.log(result)
  }

  next() {
    this.router.navigate(['/app/dashboard'])
  }

}
