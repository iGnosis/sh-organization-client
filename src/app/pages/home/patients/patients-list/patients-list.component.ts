import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { DashboardState, Patient } from 'src/app/pointmotion';
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

  displayedColumns: string[] = ['total_count', 'nickname', 'lastActive', 'activities', 'activeDays'];
  dataSource = new MatTableDataSource();
  initialSelection = [];
  allowMultiSelect = true;
  selection: any;
  row: any;
  isShowDiv = true;
  isShowFilter = true;
  selected: any;

  dateSubscription: Subscription;
  patientListSubscription: Subscription;

  constructor(
    private router: Router, 
    private graphqlService: GraphqlService,
    private _liveAnnouncer: LiveAnnouncer,
    private store: Store<{ dashboard: DashboardState }>
  ) { }

  async ngOnInit(): Promise<void> {
    this.dateSubscription = this.store.select('dashboard').subscribe(async (state: any) => {
      await this.reloadPatientList(state.dateRange);
      this.selection = new SelectionModel(this.allowMultiSelect, this.initialSelection);
    });
  }
  ngOnDestroy(): void {
    this.patientListSubscription.unsubscribe();
    this.dateSubscription.unsubscribe();
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

  togglefilterDiv(){
    this.isShowFilter=!this.isShowFilter;
  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }


  async reloadPatientList(dateRange: number) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    this.dataSource.data = await new Promise((resolve, reject) => {
      const patientListResponse = new Observable(observer => {
        this.graphqlService.gqlRequest(GqlConstants.GET_ALL_PATIENTS, {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }, true).then(data => {
          observer.next(data);
          observer.complete();
        }).catch(error => {
          observer.error(error);
        });
      });

      this.patientListSubscription = 
        this.transformPatientList(patientListResponse)
        .subscribe((patientsWithActiveDays: any) => {
          resolve(patientsWithActiveDays || []);
        });
    });
  }

  transformPatientList(patientsList: Observable<any>): Observable<any[]> {
    return patientsList.pipe(
    map((data: any) => data.patient),
    map((patients: any[]) => {
      return patients.map((patient: any) => {
        const activeDays = patient.games.reduce((acc: any, game: any) => {
          const createdAt = new Date(game.createdAt);
          if (!acc.includes(createdAt.toDateString())) {
            acc.push(createdAt.toDateString());
          }
          return acc;
        }, []).length;
        const lastActive = patient.games[0] ? patient.games[0].createdAt : null;
        const activities = patient.games.length;
        return {
          ...patient,
          activeDays,
          lastActive,
          activities
        }
      });
    })
  )
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
