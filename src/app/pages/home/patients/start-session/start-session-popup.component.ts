import { Component, OnInit } from '@angular/core';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { environment } from 'src/environments/environment';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { EventEmitterService } from 'src/app/services/eventemitter/event-emitter.service';
import { SessionService } from 'src/app/services/session/session.service';
import { CarePlanService } from 'src/app/services/care-plan/care-plan.service';

@Component({
  selector: 'start-session-pop-up',
  templateUrl: 'start-session-popup.component.html',
})

export class StartSessionPopUp implements OnInit {
  activeCarePlans: any | undefined;
  patientId: any='';
  data:any;
  public static apiURL: string
  constructor(
    private sessionService: SessionService,
    private carePlanService: CarePlanService,
    public eventEmitterService : EventEmitterService
  ) { }

  ngOnInit() {
    this.eventEmitterService.ReceivedPatientID.subscribe((data:any) => {
      this.patientId=data;
      this.fetchActiveCareplans();
    });
  }

  async fetchActiveCareplans(){
    const response = await this.carePlanService.getCarePlansForPatient(this.patientId)
    this.activeCarePlans = response.patient[0].patient_careplans;
  }

  async createNewSessionAndRedirect(carePlan: string) {
    const sessionId = await this.createNewSession(carePlan)
    // this.goToLink(`${environment.activityEndpoint}?sessionId=${sessionId}`)
  }

  async createNewSession(careplan: string) {
    const session = await this.sessionService.new(this.patientId, careplan)
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
