import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CreateCareplanComponent } from 'src/app/components/careplan/create-careplan/create-careplan.component';
import { CarePlanService } from 'src/app/services/care-plan/care-plan.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.scss']
})
export class PatientAddComponent implements OnInit {

  medicalConditionsList:any = []
  selectedMedicalConditions:any = []
  dropdownSettings:IDropdownSettings = {}
  availableGenres: any = []
  selectedGenres: any = []
  showCarePlans = true

  availableCarePlans: any = []
  selectedCarePlans: any = []

  identifier?: string
  stage = 1
  id?: string

  constructor(
    private patientService: PatientService, 
    private router: Router,
    private careplanService: CarePlanService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private route: ActivatedRoute) { }
 
  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.id = params.get('id') || ''
      // Move the user to care plan section if there is an id
      if (this.id) {
        this.stage = 2
      } else {
        this.stage = 1
      }
    })

    this.medicalConditionsList = [
      { id: 1, name: `Parkinson's` },
      { id: 2, name: `Alzheimer's` },
      { id: 3, name: `Huntington's` },
      { id: 4, name: `Others` },
    ];
    this.availableGenres = [
      {id: 1, name: 'Rock'},
      {id: 1, name: 'Classical'},
      {id: 1, name: 'Jazz'},
      {id: 1, name: 'Pop'},
      {name: 'Others'}
    ]
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'name',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
  }

  async addPatient() {
    const medicalConditions:any = {}
    const preferredGenres:any = {}

    this.selectedMedicalConditions.map((x:any) => { medicalConditions[x.name] = true })
    this.selectedGenres.map((x:any) => { preferredGenres[x.name] = true })

    const patient = {
      identifier: this.identifier,
      medicalConditions,
      preferredGenres
    }
    
    const response = await this.patientService.insertPatient(patient)
    console.log(response);
    this.id = response.insert_patient_one.id
    this.router.navigate([`/app/patients/${this.id}/care-plan`])
  }
  
  async openCreateCarePlanModal() {
    const modalRef = this.modalService.open(CreateCareplanComponent, {windowClass: 'lg-modal'})
                                          .result.then(success => {
                                            this.reloadCarePlans()
                                          }, failure => {
                                            this.reloadCarePlans()
                                          })
  }

  reloadCarePlans() {
    this.showCarePlans = false
      setTimeout(() => {
        this.showCarePlans = true
      }, 300)
  }

  async updateCarePlan(event:any){
    let rowsAffected = 0
    if(event.checked) {
      const careplans = event.items.map((x:any) => { return {careplan: x.id}})
      careplans.forEach((x:any) => x.patient = this.id)
      rowsAffected = await this.careplanService.attachCarePlan(careplans)
      this.toastService.show(`Assigned ${rowsAffected} Care Plan(s) to the Patient`)
    } else if(this.id) {
      const careplans = event.items.map((x:any) =>  x.id)
      rowsAffected = await this.careplanService.detachCarePlan(this.id, careplans)
      this.toastService.show(`Removed ${rowsAffected} Care Plan(s) from the Patient`)
    }
  }
}
