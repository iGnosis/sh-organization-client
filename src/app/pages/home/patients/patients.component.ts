import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { JwtService } from 'src/app/services/jwt/jwt.service';
import { Patient } from 'src/app/types/patient';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  patients?: Array<Patient>
  allMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"]
  selectedMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"]

  constructor(private router: Router, private jwtService: JwtService) { }

  async ngOnInit() {
    // workaround for JWT not being read on initialization
    this.jwtService.getToken()
    this.reloadPatientList(null)
  }

  async reloadPatientList(filters: any) {
    const response = await GraphqlService.client.request(GqlConstants.GET_ALL_PATIENTS, { conditions: this.selectedMedicalConditions })
    this.patients = response.patient
    console.log(this.patients)
  }

  openPatientDetailsPage(patientId: string) {
    this.router.navigate(['/app/patients/', patientId])
  }

  selectDataSegment(condition: string) {
    this.selectedMedicalConditions = [condition]
    this.reloadPatientList({})
  }
}
