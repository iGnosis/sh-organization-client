import { Injectable } from '@angular/core';
import { gql } from 'graphql-request';
import { GraphqlService } from '../graphql/graphql.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor() { }

  async getAll() {
    const query = gql`query GetActivities {
      activity {
        name
        id
        details
        createdAt
        difficulty
        duration
        updatedAt
      }
    }`

    const response = await GraphqlService.client.request(query)
    return response.activity
  }
}
