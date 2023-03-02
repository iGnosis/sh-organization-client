import { Component, OnInit } from '@angular/core';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { environment } from 'src/environments/environment';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { EventEmitterService } from 'src/app/services/eventemitter/event-emitter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PatientDetailsComponent } from '../patient-details/patient-details.component';

@Component({
  selector: 'add-careplan-pop-up',
  templateUrl: 'add-careplan-popup.component.html',
})

export class AddCareplan implements OnInit {
  all_careplans: any | undefined=[];
  patients_careplan : any | undefined;
  patientId: any='';
  searchText:any;
  data:any;
  careplans_list : any | undefined=[];
  selectedCarePlanId: string
  public static apiURL: string
  selectedService:any;
  constructor(
    private graphqlService: GraphqlService,
    public eventEmitterService : EventEmitterService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.eventEmitterService.ReceivedPatientID.subscribe((data:any) => {
      this.patientId=data;
      this.fetchActiveCareplans();
});

  }
  async fetchActiveCareplans(){
    const response = await this.graphqlService.client.request(GqlConstants.GET_PATIENT_ACTIVEPLANS, { patientId: this.patientId})
    this.all_careplans = response.careplan;
    //console.log(response,">>>>response.....");
    this.patients_careplan=response.patient[0].patient_careplans
    for(const patient_data of this.all_careplans){
      for(const pt_data of this.patients_careplan){
        if(pt_data.careplanByCareplan.name==patient_data.name){
          this.careplans_list.push({ name:patient_data.name,value: 'true',id:patient_data.id });
        }
      }
    }
    for(const patient_data of this.all_careplans){
      if(this.patients_careplan.length==0)
      {
        this.careplans_list.push({ name:patient_data.name,value: 'false',id:patient_data.id });
      }
      for(const pt_data of this.patients_careplan){
        if(pt_data.careplanByCareplan.name!=patient_data.name){
          const isPresent = this.careplans_list.some(function(el:any){ return el.name === patient_data.name});
          if(isPresent==false)
          {
            this.careplans_list.push({ name:patient_data.name,value: 'false',id:patient_data.id });
          }
        }
      }
    }
  }
  async removeCareplanFromPatient(getcareplan: string, modalContent: any) {
    this.modalService.open(modalContent)
    this.selectedCarePlanId = getcareplan
    localStorage.removeItem("reload");
  }
  async confirmRemoveCarePlan() {
    const removecareplan = await this.graphqlService.client.request(GqlConstants.DELETE_PATIENT_CAREPLAN, {careplan: this.selectedCarePlanId,patient: this.patientId })
    window.location.reload();
    return removecareplan.delete_patient_careplan.affected_rows
    localStorage.setItem("reload", "0");
  }

  async addCarePlan(getcareplan: string) {
    const addcareplan = await this.graphqlService.client.request(GqlConstants.POST_SESSION_ADDED_DATA, { patient: this.patientId, careplan: getcareplan })
    if (
      addcareplan &&
      addcareplan.insert_patient_careplan &&
      addcareplan.insert_patient_careplan.returning &&
      Array.isArray(addcareplan.insert_patient_careplan.returning) &&
      addcareplan.insert_patient_careplan.returning.length == 1 &&
      addcareplan.insert_patient_careplan.returning[0].id
    ) {
      const sessionId = addcareplan.insert_patient_careplan.returning[0].careplan
      return sessionId
    }
    window.location.reload();
  }
}
