import { Injectable } from '@angular/core';
import { GqlConstants } from '../gql-constants/gql-constants.constants';
import { GraphqlService } from '../graphql/graphql.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private graphqlService: GraphqlService) { }

  new(patient: string, careplan: string) {
    return this.graphqlService.client.request(GqlConstants.CREATE_SESSION, { patient, careplan })
  }

}
