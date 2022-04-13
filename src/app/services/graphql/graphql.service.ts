import { Injectable } from '@angular/core';
import { GraphQLClient } from 'graphql-request'
import { environment } from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  public client: GraphQLClient = new GraphQLClient(environment.gqlEndpoint, {
    headers: {
      'Authorization': 'Bearer ' + _getItem('token')
    }
  })
  public publicClient: GraphQLClient = new GraphQLClient(environment.gqlEndpoint, {})

  constructor() { }
}

function _getItem(key: string) {
  const value = localStorage.getItem(key)
  console.log('_getItem:key:value -', key, value)
  return value
}
