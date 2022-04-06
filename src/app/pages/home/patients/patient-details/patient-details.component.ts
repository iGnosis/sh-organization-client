import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { Patient } from 'src/app/types/patient';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  isRowsChecked = false
  patientId?: string
  details?: Patient

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.patientId = params.get('id') || ''
      if (this.patientId) {
        console.log('patientId:', this.patientId);
        // const response = await GraphqlService.client.request(GqlConstants.GET_PATIENT_DETAILS, { user: this.id })
        // this.details = response.user_by_pk
        // console.log(this.details)
      }
    })
  }

  async createNewSessionAndRedirect() {
    const sessionId = await this.createNewSession()
    this.goToLink(`${environment.activityEndpoint}?sessionId=${sessionId}`)
  }

  async createNewSession() {
    const session = await GraphqlService.client.request(GqlConstants.CREATE_SESSION, { patient: this.patientId, careplan: '4e2aa726-b07f-4f44-a4fd-fc228c93bfc7' })
    if (
      session &&
      session.insert_session &&
      session.insert_session.returning &&
      Array.isArray(session.insert_session.returning) &&
      session.insert_session.returning.length == 1 &&
      session.insert_session.returning[0].id
    ) {
      const sessionId = session.insert_session.returning[0].id
      console.log('createSessionAndRedirect:sessionId', sessionId)
      return sessionId
    }
  }

  goToLink(url: string) {
    console.log(`goToLink:Redirecting user to ${url}...`)
    window.open(url, '_blank')
  }

  toogleRowsCheck() {
    const formCheckinputs = document.querySelectorAll('.row-check-input')
    if (this.isRowsChecked) {
      formCheckinputs.forEach(arr => {
        arr.removeAttribute('checked')
      })
    } else {
      formCheckinputs.forEach(arr => {
        arr.setAttribute('checked', '')
      })
    }
    this.isRowsChecked = !this.isRowsChecked
  }
}
