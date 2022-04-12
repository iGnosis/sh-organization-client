import { Injectable } from '@angular/core';
import { gql } from 'graphql-request';
import { CarePlan } from 'src/app/types/careplan';
import { GraphqlService } from '../graphql/graphql.service';

@Injectable({
  providedIn: 'root'
})
export class CarePlanService {

  constructor(private graphqlService: GraphqlService) { }

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

    const response = await this.graphqlService.client.request(query)
    return response.careplan
  }

  /**
   *
   * @param user userId of the user
   * @param careplan  careplanID of the careplan
   */
  async attachCarePlan(careplans: any) {
    const mutation = gql`mutation AttachCarePlan($obj:[patient_careplan_insert_input!]!) {
      insert_patient_careplan(objects: $obj) {
        affected_rows
      }
    }`
    const response = await this.graphqlService.client.request(mutation, { obj: careplans })
    return response.insert_patient_careplan.affected_rows
  }


  /**
   *
   * @param patient id of the patient
   * @param careplans  Array of careplan ids
   */
  async detachCarePlan(patient: string, careplans: Array<string>) {
    const mutation = gql`mutation DetachCarePlan($careplans: [uuid!], $patient: uuid) {
      delete_patient_careplan(where: {careplan: {_in: $careplans}, patient: {_eq: $patient}}) {
        affected_rows
      }
    }`
    const response = await this.graphqlService.client.request(mutation, { careplans, patient })
    return response.delete_patient_careplan.affected_rows
  }


  async create(careplan: CarePlan) {
    console.log(careplan)
    const mutation = gql`mutation InsertCarePlan($careplan: careplan_insert_input!) {
      insert_careplan_one(object: $careplan) {
        id
      }
    }`
    const response = await this.graphqlService.client.request(mutation, { careplan })
    return response.insert_careplan_one
  }

  async attachActivities(careplanActivities: any) {
    const mutation = gql`mutation AddActivityToCarePlan($objects:[careplan_activity_insert_input!]!) {
      insert_careplan_activity(objects: $objects) {
        affected_rows
      }
    }`
    const response = await this.graphqlService.client.request(mutation, { objects: careplanActivities })
    return response.insert_careplan_activity.affected_rows
  }

  async detachActivities(careplanId: string, activityIds: Array<string>) {

  }
}
