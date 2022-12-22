import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Patient } from 'src/app/pointmotion';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit {
  allMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"];
  selectedMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('TableOnePaginator', { static: true }) tableOnePaginator: MatPaginator;
  patients?: Array<Patient>;

  displayedColumns: string[] = ['total_count', 'nickname', 'lastActive'];
  dataSource = new MatTableDataSource();
  initialSelection = [];
  allowMultiSelect = true;
  selection: any;
  row: any;
  isShowDiv = true;
  isShowFilter = true;
  selected: any;

  constructor(private router: Router, private graphqlService: GraphqlService,private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.reloadPatientList(null);
    this.selection = new SelectionModel(this.allowMultiSelect, this.initialSelection);
    this.toggleDisplayedColumns();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.tableOnePaginator;
    // let element : HTMLElement = document.getElementsByClassName(".patients_table tbody tr") as unknown as HTMLElement;
    // element.click();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleDisplayedColumns() {
    const isPatientsList = this.router.url === '/app/patients';
    this.displayedColumns = [...this.displayedColumns, ...(isPatientsList ? ['time_spent', 'actions'] : ['lastGame', 'sessions_aggregate', 'actions'])];
  }

  togglefilterDiv(){
    this.isShowFilter=!this.isShowFilter;
  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }
  async reloadPatientList(filters: any) {
    const response = await this.graphqlService.gqlRequest(GqlConstants.GET_ALL_PATIENTS, {}, true);
    this.patients = response.patient;

    const renamedGame = (gameObj: any) => {
      const spacedName = gameObj['game'].replace(/_/g, ' ');

      return {
        ...gameObj,
        game: spacedName,
      };
  };

    this.patients = this.patients?.map((patient) => {
      return {
        ...patient,
        games: patient.games?.map(renamedGame)
      };
    });

    this.dataSource.data = this.patients as any[];
    this.dataSource.data.forEach((data: any) => {
      data.lastActive = data.games[0] && data.games[0].createdAt ? data.games[0].createdAt : null
      data.lastGame = data.games[0] && data.games[0].game ? data.games[0].game : ''
    })
    console.log(this.dataSource.data);
  }

  openPatientDetailsPage(patientId: any) {
    this.router.navigate(['/app/patients/', patientId])
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
}
