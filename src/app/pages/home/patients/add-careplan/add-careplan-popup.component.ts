import { Component, OnInit } from '@angular/core';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { environment } from 'src/environments/environment';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { EventEmitterService } from 'src/app/services/eventemitter/event-emitter.service';
import { forEachChild } from 'typescript';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'add-careplan-pop-up',
  templateUrl: 'add-careplan-popup.component.html',
})

export class AddPatient implements OnInit {
  all_careplans: any | undefined=[];
  patients_careplan : any | undefined;
  patientId: any='';
  data:any;
  careplans_list : any | undefined=[];
  selectedCarePlanId: string
  private modalService: NgbModal
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
      if(this.patients_careplan.length==0)
      {
        this.careplans_list.push({ name:patient_data.name,value: 'false' });
      }
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
    console.log(this.patients_careplan.length);
  }
  async removeCareplanFromPatient(careplan: string, modalContent: any) {
    console.log(careplan)
    this.modalService.open(modalContent)
    this.selectedCarePlanId = careplan
  }
}
