import { Component, OnInit, ViewChild } from '@angular/core';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { environment } from 'src/environments/environment';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { EventEmitterService } from 'src/app/services/eventemitter/event-emitter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarePlanDetailComponent } from '../care-plan-detail/care-plan-detail.component';
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
@Component({
  selector: 'add-patient-pop-up',
  templateUrl: 'add-patient-popup.component.html',
})

export class AddPatient implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  all_careplans: any | undefined=[];
  patients_careplan : any | undefined;
  patientList: any | undefined = [];
  searchText:any;
  data:any;
  selectedCarePlanId: string
  public static apiURL: string
  selectedService:any;
  constructor(
    private graphqlService: GraphqlService,
    public eventEmitterService : EventEmitterService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.eventEmitterService.ReceivedCarePlanID.subscribe((data:any) => {
    this.patientList=data.patientList;
    this.patients_careplan=data.careplanId
    this.fetchActiveCareplans();
});

  }
  async fetchActiveCareplans(){
    const response = await this.graphqlService.client.request(GqlConstants.ADD_PATIENT_IN_CAREPLAN, { careplan: this.patients_careplan})
    this.all_careplans = response.patient.filter((patientid:any) => !this.patientList.some((careplanid:any) => patientid.id === careplanid.patientByPatient.id));
  }
  async addPatient(getcareplan: string) {
    const addcareplan = await this.graphqlService.client.request(GqlConstants.POST_SESSION_ADDED_DATA, { patient: getcareplan, careplan: this.patients_careplan })
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
