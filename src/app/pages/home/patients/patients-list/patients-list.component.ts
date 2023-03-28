import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, Subscription } from 'rxjs';
import { ArchiveMemberModalComponent } from 'src/app/components/archive-member-modal/archive-member-modal.component';
import { DashboardState, Patient } from 'src/app/pointmotion';
import { ApiService } from 'src/app/services/api/api.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss'],
})
export class PatientsListComponent implements OnInit {
  @Input('showButtons') showButtons = false;
  allMedicalConditions = [
    "Parkinson's",
    "Huntington's",
    "Alzheimer's",
    'Others',
  ];
  selectedMedicalConditions = [
    "Parkinson's",
    "Huntington's",
    "Alzheimer's",
    'Others',
  ];

  @Input() selectedDateRange: number;

  @ViewChild('invitePatient') invitePatientModal: TemplateRef<any>;
  @ViewChild('addPatient') addPatientModal: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('TableOnePaginator', { static: true })
  tableOnePaginator: MatPaginator;
  patients?: Array<Patient>;

  displayedColumns: string[] = [
    'total_count',
    'nickname',
    'lastActive',
    'activities',
    'activeDays',
    'subscription_status',
    'actions',
  ];
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

  addPatientModalState: Subject<boolean> = new Subject<boolean>();
  invitePatientModalState: Subject<boolean> = new Subject<boolean>();

  isPublicSignupEnabled: boolean;
  disablePatientDetails = true;

  constructor(
    private router: Router,
    private graphqlService: GraphqlService,
    private _liveAnnouncer: LiveAnnouncer,
    private store: Store<{ dashboard: DashboardState }>,
    private modalService: NgbModal,
    private apiService: ApiService,
    private userService: UserService
  ) {
    this.getPublicSignup();
    this.checkPatientDetailsAccess();
  }

  async ngOnInit(): Promise<void> {
    this.dateSubscription = this.store
      .select('dashboard')
      .subscribe(async (state: any) => {
        await this.reloadPatientList(state.dateRange);
        this.selection = new SelectionModel(
          this.allowMultiSelect,
          this.initialSelection
        );
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

  async getPublicSignup() {
    this.isPublicSignupEnabled = await this.apiService.getPublicSignup();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  togglefilterDiv() {
    this.isShowFilter = !this.isShowFilter;
  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  async reloadPatientList(dateRange: number) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    this.dataSource.data = await new Promise((resolve, reject) => {
      const patientListResponse = new Observable((observer) => {
        this.graphqlService
          .gqlRequest(
            GqlConstants.GET_ALL_PATIENTS,
            {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            },
            true
          )
          .then((data) => {
            observer.next(data);
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
          });
      });

      this.patientListSubscription = this.transformPatientList(
        patientListResponse
      ).subscribe((patientsWithActiveDays: any[]) => {
        console.log('patientsList::', patientsWithActiveDays);

        // // removing patients that are not active
        // const filteredPatientsWithActiveDays = patientsWithActiveDays.filter(
        //   (patient) => patient.lastActive
        // );
        // resolve(filteredPatientsWithActiveDays || []);
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

          const lastActive = patient.games[0]
            ? patient.games[0].createdAt
            : null;

          const activities = patient.games.length;

          return {
            ...patient,
            activeDays,
            lastActive,
            activities,
          };
        });
      })
    );
  }

  openPatientDetailsPage(patientId: any) {
    this.router.navigate(['/app/patients/', patientId]);
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

  openArchiveMemberModal(patientId: string, nickname: string) {
    const modalRef = this.modalService.open(ArchiveMemberModalComponent);
    modalRef.componentInstance.type = 'patient';
    modalRef.componentInstance.name = nickname;
    modalRef.componentInstance.id = patientId;
    this.dataSource.data.filter((element: any) => element.id === patientId);
  }

  openInvitePatientModal() {
    this.modalService.open(this.invitePatientModal, {
      size: 'lg',
      beforeDismiss: () => {
        this.invitePatientModalState.next(false);
        return true;
      },
    });
    this.invitePatientModalState.next(true);
  }

  openAddPatientModal() {
    this.modalService.open(this.addPatientModal, {
      size: 'lg',
      beforeDismiss: () => {
        this.addPatientModalState.next(false);
        return true;
      },
    });
  }

  checkPatientDetailsAccess() {
    const currentUserRole = this.userService.get().type;
    this.disablePatientDetails = currentUserRole === 'org_admin';
  }
}
