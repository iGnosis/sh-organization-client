import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { Patient } from 'src/app/types/patient';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {ChangeDetectorRef } from '@angular/core';

let ELEMENT_DATA:any;
let dataSource:any;

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator | undefined;
  patients?: Array<Patient>
  allMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"]
  selectedMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"]
  cdref: any;

  constructor(private router: Router, private graphqlService: GraphqlService) { }

  async ngOnInit() {
    this.reloadPatientList(null)
  }

  async reloadPatientList(filters: any) {
    const response = await this.graphqlService.client.request(GqlConstants.GET_ALL_PATIENTS, { conditions: this.selectedMedicalConditions })
    this.patients = response.patient;
    console.log(this.patients);
    this.patients_data = this.patients;
    ELEMENT_DATA=this.patients_data;
    // console.log(ELEMENT_DATA,"element");
    this.dataSource=this.patients;
    // console.log(this.dataSource,"ele");
  }
  dataSource = ELEMENT_DATA;
  patients_data?: Array<Patient>;
  openPatientDetailsPage(patientId: string) {
    this.router.navigate(['/app/patients/', patientId])
  }

  selectDataSegment(condition: string) {
    this.selectedMedicalConditions = [condition]
    this.reloadPatientList({})
  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.dataSource);
    this.dataSource.paginator = this.paginator;
    //console.log(this.paginator,"paginator");
    this.cdref.detectChanges();
}
displayedColumns: string[] = ['total_count','identifier', 'medical_condition', 'last_session', 'sessions','therapist','actions'];
}
export interface PeriodicElement {
  total_count: string;
  identifier: string;
  medical_condition: string;
  last_session: string;
  sessions : string;
  therapist : string;
  actions : any;
}
