import { Injectable } from '@angular/core';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor() {
  }

  // TODO make it more strictly typed
  insertPatient(patient: any) {
    return GraphqlService.client.request(GqlConstants.INSERT_PATIENT, patient)
  }
}
