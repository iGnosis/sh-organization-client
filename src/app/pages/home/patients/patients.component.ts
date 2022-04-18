import { Component, OnInit, ViewChild   } from '@angular/core';
import { Router } from '@angular/router';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { Patient } from 'src/app/types/patient';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {ChangeDetectorRef } from '@angular/core';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  patients?: Array<Patient>;
  allMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"];
  selectedMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"];
  displayedColumns: string[] = ['total_count','identifier', 'medical_condition', 'last_session', 'sessions','therapist','actions'];
  dataSource = new MatTableDataSource();
  @ViewChild('TableOnePaginator', { static: true }) tableOnePaginator: MatPaginator;

  constructor(private router: Router, private graphqlService: GraphqlService) { }

  async ngOnInit() {
    this.reloadPatientList(null)
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.tableOnePaginator;
  }

  async reloadPatientList(filters: any) {
    const response = await this.graphqlService.client.request(GqlConstants.GET_ALL_PATIENTS, { conditions: this.selectedMedicalConditions })
    this.patients = response.patient
    // console.log(this.patients)
    this.dataSource.data = response.patient;
  }
  patients_data?: Array<Patient>;
  openPatientDetailsPage(patientId: string) {
    this.router.navigate(['/app/patients/', patientId])
  }

  selectDataSegment(condition: string) {
    this.selectedMedicalConditions = [condition]
    this.reloadPatientList({})
  }
}
