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
  isShowDiv = true;

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }
  filterEntity: SpaceCraft;
  filterType: MatTableFilter;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  patients?: Array<Patient>;
  allMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"];
  selectedMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"];
  displayedColumns: string[] = ['total_count','identifier', 'medical_condition', 'last_session', 'sessions_aggregate','therapist','actions'];
  dataSource = new MatTableDataSource();
  initialSelection = [];
  allowMultiSelect = true;
  selection:any;
  row : any;
  seachValue:any;
  @ViewChild('TableOnePaginator', { static: true }) tableOnePaginator: MatPaginator;
  constructor(private router: Router, private graphqlService: GraphqlService,private _liveAnnouncer: LiveAnnouncer) { }

  async ngOnInit() {
    this.reloadPatientList(null);
    this.selection = new SelectionModel(this.allowMultiSelect, this.initialSelection);
    this.filterEntity = new SpaceCraft();
    this.filterEntity.captain = new Captain();
    this.filterType = MatTableFilter.ANYWHERE;
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
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.tableOnePaginator;
    // let element : HTMLElement = document.getElementsByClassName(".patients_table tbody tr") as unknown as HTMLElement;
    // element.click();
  }
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  async reloadPatientList(filters: any) {
    const response = await this.graphqlService.client.request(GqlConstants.GET_ALL_PATIENTS, { conditions: this.selectedMedicalConditions })
    this.patients = response.patient
    console.log(response.patient)
    this.dataSource.data = response.patient;
  }
  patients_data?: Array<Patient>;
  openPatientDetailsPage(patientId: any) {
    this.router.navigate(['/app/patients/', patientId])
  }

  selectDataSegment(condition: string) {
    this.selectedMedicalConditions = [condition]
    this.reloadPatientList({})
  }
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
