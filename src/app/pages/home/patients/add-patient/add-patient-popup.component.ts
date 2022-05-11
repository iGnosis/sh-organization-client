import { Component, OnInit } from '@angular/core';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { environment } from 'src/environments/environment';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { EventEmitterService } from 'src/app/services/eventemitter/event-emitter.service';
import { forEachChild } from 'typescript';

@Component({
  selector: 'add-patient-pop-up',
  templateUrl: 'add-patient-popup.component.html',
})

export class AddPatient implements OnInit {
  all_careplans: any | undefined=[];
  patients_careplan : any | undefined;
  patientId: any='';
  data:any;
  careplans_list : any | undefined=[];
  all_list:any|undefined=[];
  public static apiURL: string
  constructor(
    private graphqlService: GraphqlService,
    public eventEmitterService : EventEmitterService
  ) { }

  ngOnInit() {
    this.eventEmitterService.ReceivedPatientID.subscribe((data:any) => {
this.patientId=data;
console.log(this.patientId);
      this.fetchActiveCareplans();
});

  }
  async fetchActiveCareplans(){
    const response = await this.graphqlService.client.request(GqlConstants.GET_PATIENT_ACTIVEPLANS, { patientId: this.patientId})
    this.all_careplans = response.careplan;
    this.patients_careplan=response.patient[0].patient_careplans
    for(const patient_data of this.all_careplans){
      for(const pt_data of this.patients_careplan){
        if(pt_data.careplanByCareplan.name==patient_data.name){
          this.careplans_list.push({ name:patient_data.name,value: 'true' });
          //console.log(this.careplans_list);
        }
      }
    }
    for(const patient_data of this.all_careplans){
      for(const pt_data of this.patients_careplan){
        if(pt_data.careplanByCareplan.name!=patient_data.name){
          const isPresent = this.careplans_list.some(function(el:any){ return el.name === patient_data.name});
          if(isPresent==false)
          {
            this.careplans_list.push({ name:patient_data.name,value: 'false' });
          }
        }
      }
    }
    console.log(this.careplans_list);
  }
}
