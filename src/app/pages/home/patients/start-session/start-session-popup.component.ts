import { Component, OnInit } from '@angular/core';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { environment } from 'src/environments/environment';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { EventEmitterService } from 'src/app/services/eventemitter/event-emitter.service';

@Component({
  selector: 'start-session-pop-up',
  templateUrl: 'start-session-popup.component.html',
})

export class StartSessionPopUp implements OnInit {
  active_careplans: any | undefined;
  patientId: any='';
  data:any;
  public static apiURL: string
  constructor(
    private graphqlService: GraphqlService,
    public eventEmitterService : EventEmitterService
  ) { }

  ngOnInit() {
    this.eventEmitterService.ReceivedPatientID.subscribe((data:any) => {
this.patientId=data;
      this.fetchActiveCareplans();
});

//this.patientId=StartSessionPopUp.apiURL
//console.log(this.patientId,"patient")
  }
  async fetchActiveCareplans(){
    const response = await this.graphqlService.client.request(GqlConstants.GET_ACTIVEPLANS, { patientId: this.patientId})
    this.active_careplans = response.patient[0].patient_careplans;
  }
  async createNewSessionAndRedirect() {
    const sessionId = await this.createNewSession()
    this.goToLink(`${environment.activityEndpoint}?sessionId=${sessionId}`)
  }
  async createNewSession() {
    const session = await this.graphqlService.client.request(GqlConstants.CREATE_SESSION, { patient: this.patientId, careplan: '4e2aa726-b07f-4f44-a4fd-fc228c93bfc7' })
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
}
