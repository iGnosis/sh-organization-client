import { Component, OnInit, ViewChild   } from '@angular/core';
import { Router } from '@angular/router';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { Patient } from 'src/app/types/patient';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {ChangeDetectorRef } from '@angular/core';
import {MatSort, Sort, SortDirection} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {SelectionModel} from '@angular/cdk/collections';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableFilter } from 'mat-table-filter';
import {FormControl} from '@angular/forms';
export class Captain {
  identifier: string;
  surname: string;
  medicalConditions : any;
  therapist : string;
}

export class SpaceCraft {
  identifier: string;
  medicalConditions : any;
  isConstitutionClass: boolean;
  captain: Captain;
  therapist : string;
}
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})

export class PatientsComponent implements OnInit {
  
  
  allMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"];
  selectedMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"];
  
  
  
  constructor() { }

  async ngOnInit() {
    
  }

  selectDataSegment(condition: string) {
    this.selectedMedicalConditions = [condition]
    // this.reloadPatientList({})
  }
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  // const numRows = this.dataSource.data.length;
  // return numSelected == numRows;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   console.log("selected");
  //   this.isAllSelected()?
  //   this.selection.clear() :
  //     this.dataSource.data.forEach(row => this.selection.select(row));
  // }
  
  
  
}
// export interface PeriodicElement {
//   total_count: number;
//   identifier: string;
//   medical_condition: any;
//   last_session: Date;
//   sessions : number;
//   therapist : string;
//   actions : any;
// }
