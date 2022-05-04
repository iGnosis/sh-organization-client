import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'start-session-pop-up.component.html',
})
export class StartSessionPopUp {
  selectedMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"];
  patientId?: string
  itemsPerPage: any;
  dataSource: any;
  patients: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private analyticsService: AnalyticsService,
    private graphqlService: GraphqlService,
  ) { }
  ngOnInit() {
    this.fetchSessions(null);
     this.route.paramMap.subscribe(async (params: ParamMap) => {
       this.patientId = params.get('id') || ''
       if (this.patientId) {
    console.log('patientId:', this.patientId);
       }
       else
       {
         console.log("not in if",this.route);
       }
     })
  }
  async fetchSessions(filters: any) {
    // we need to show sessions of a patient.
   // const response = await this.graphqlService.client.request(GqlConstants.GET_ACTIVEPLANS,{patientId: this.patientId})
    //this.patients = response.patient
    //console.log(response.patient)
  }
}
