import { Injectable } from '@angular/core';
import { request, GraphQLClient } from 'graphql-request'
import { environment } from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  public static client: GraphQLClient = new GraphQLClient(environment.gqlEndpoint, { headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }})
  public static publicClient: GraphQLClient = new GraphQLClient(environment.gqlEndpoint, {})

  constructor() {}

}
