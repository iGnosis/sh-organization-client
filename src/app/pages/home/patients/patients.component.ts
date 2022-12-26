import { Component, OnInit, ViewChild   } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})

export class PatientsComponent implements OnInit {

  @ViewChild('invitePatient') invitePatientModal: TemplateRef<any>;
  @ViewChild('addPatient') addPatientModal: TemplateRef<any>;
  addPatientModalState: Subject<boolean> = new Subject<boolean>();
  invitePatientModalState: Subject<boolean> = new Subject<boolean>();

  allMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"];
  selectedMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"];


  constructor(private modalService: NgbModal) {}

  async ngOnInit() {}

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
    this.selectedMedicalConditions = [condition]
  }
}
