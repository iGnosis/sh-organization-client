import { Injectable } from '@angular/core';
import { GqlConstants } from '../gql-constants/gql-constants.constants';
import { GraphqlService } from '../graphql/graphql.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private gqlService: GraphqlService, 
    private userService: UserService,
  ) { }


  async getPublicSignup() {
    try {
      const response = await this.gqlService.gqlRequest(GqlConstants.GET_PUBLIC_SIGNUP);
      return response.organization[0].isPublicSignUpEnabled || false;
    } catch (error) {
      console.log(error);
    }
  }

  async setPublicSignup(isPublicSignUpEnabled: boolean) {
    try {
      const response = await this.gqlService.gqlRequest(GqlConstants.SET_PUBLIC_SIGNUP, {
        id: this.userService.get().orgId,
        isPublicSignUpEnabled,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
