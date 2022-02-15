import { Injectable } from '@angular/core';
import { gql } from 'graphql-request';
import { GraphqlService } from '../graphql/graphql.service';

@Injectable({
  providedIn: 'root'
})
export class CarePlanService {

  constructor() { }

  async getAll() {
    const query = gql`query GetCarePlans {
      careplan {
        createdAt
        estimatedDuration
        difficultyLevel
        careplan_activities_aggregate {
          aggregate {
            count
          }
        }
        user_careplans_aggregate {
          aggregate {
            count
          }
        }
        name
        createdBy
        id
        tags
        careplan_activities {
          activityByActivity {
            name
            duration
            difficulty
          }
          activity
          reps
        }
      }
    }`

    const response = await GraphqlService.client.request(query)
    return response.careplan
  }
}
