import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { PatientsListComponent } from './patients-list/patients-list.component';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit, AfterViewInit {
  @ViewChild('invitePatient') invitePatientModal: TemplateRef<any>;
  @ViewChild('addPatient') addPatientModal: TemplateRef<any>;
  addPatientModalState: Subject<boolean> = new Subject<boolean>();
  invitePatientModalState: Subject<boolean> = new Subject<boolean>();

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

  dateFilter: { label: string; range: number }[] = [
    { label: 'Today', range: 0 },
    { label: 'Past 7 days', range: 7 },
    { label: 'Past 14 days', range: 14 },
    { label: 'Past 30 days', range: 30 },
    { label: 'Past 90 days', range: 90 },
    { label: 'Past 180 days', range: 180 },
  ];
  selectedDateRange = 3;
  dateRange = 30;
  @ViewChild(PatientsListComponent)
  patientsListComponent: PatientsListComponent;

  isPublicSignupEnabled: boolean;

  async setDateFilter(idx: number) {
    this.selectedDateRange = idx;
    this.dateRange = this.dateFilter[idx].range;

    if (this.patientsListComponent) {
      this.patientsListComponent.reloadPatientList(this.dateFilter[idx].range);
    }
  }

  constructor(private modalService: NgbModal, private apiService: ApiService) {
    this.getPublicSignup();
  }
  ngAfterViewInit(): void {

    this.setDateFilter(3);
  }

  async ngOnInit() {}

  async getPublicSignup() {
    this.isPublicSignupEnabled = await this.apiService.getPublicSignup();
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

  selectDataSegment(condition: string) {
    this.selectedMedicalConditions = [condition];
  }
}
