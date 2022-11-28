import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Clipboard } from '@angular/cdk/clipboard';
import { BehaviorSubject } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { phone as validatePhone } from 'phone';

@Component({
  selector: 'app-users-access',
  templateUrl: './users-access.component.html',
  styleUrls: ['./users-access.component.scss'],
})
export class UsersAccessComponent implements OnInit {
  addMemberModalValue: string | undefined = undefined;
  @ViewChild('addMemberModal') addMemberModal: TemplateRef<any>;
  @ViewChild('invitePatient') invitePatientModal: TemplateRef<any>;
  @ViewChild('inviteStaff') inviteStaffModal: TemplateRef<any>;
  @ViewChild('addPatient') addPatientModal: TemplateRef<any>;
  @ViewChild('addStaff') addStaffModal: TemplateRef<any>;

  enableSaveButton = false;

  copyStatusSubject = new BehaviorSubject<'copy' | 'copied'>('copy');
  allowOnyInvitationalSignups = false;

  addMemberModalRef: NgbActiveModal;
  toggleLinkExpiry = false;
  expiryDate: string | undefined = undefined;

  // TODO: fetch data from the backend
  staffList = [
    { name: 'Arbor Acres', role: 'Org Admin', id: 'some_uuid' },
    { name: 'Leia', role: 'Org Admin', id: 'some_uuid' },
    { name: 'Ethan Hunt', role: 'Org Admin', id: 'some_uuid' },
  ];

  patientList = [
    { name: 'Benjamin', id: 'some_uuid' },
    { name: 'Anakin', id: 'some_uuid' },
    { name: 'Luke', id: 'some_uuid' },
  ];

  private patientDetails: Partial<{
    firstName: string;
    lastName: string;
    // namePrefix: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode: string;
  }> = {};

  staffDetails: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode: string;
    staffType: string;
  }> = {};

  constructor(private modalService: NgbModal, private clipboard: Clipboard) {}

  ngOnInit(): void {
    this.copyStatusSubject.subscribe((status) => {
      if (status === 'copied') {
        setTimeout(() => {
          this.copyStatusSubject.next('copy');
        }, 1000);
      }
    });
  }

  openAddMemberModal(content: TemplateRef<any>): void {
    this.addMemberModalRef = this.modalService.open(content, {
      modalDialogClass: 'custom-modal-dialog',
      beforeDismiss: () => {
        this.addMemberModalValue = undefined;
        return true;
      },
    });
  }

  openAddPatientModal() {
    this.modalService.open(this.addPatientModal, {
      size: 'lg',
      beforeDismiss: () => {
        this.patientDetails = {};
        this.validateFields('patient');
        return true;
      },
    });
  }
  openAddStaffModal() {
    this.modalService.open(this.addStaffModal, {
      size: 'lg',
      beforeDismiss: () => {
        this.staffDetails = {};
        this.validateFields('staff');
        return true;
      },
    });
  }

  openInvitePatientModal() {
    this.addMemberModalRef && this.addMemberModalRef.dismiss();
    this.modalService.open(this.invitePatientModal, {
      size: 'lg',
    });
  }

  openInviteStaffModal(type?: 'staff' | 'admin') {
    this.addMemberModalRef && this.addMemberModalRef.dismiss();
    this.modalService.open(this.inviteStaffModal, {
      size: 'lg',
    });
  }

  addNewStaff() {
    // TODO: add new staff to the db

    // emtpy the fields, so that admin can add another staff
    this.staffDetails = {};
  }
  addNewPatient() {
    // TODO: add new patient to the db

    this.patientDetails = {};
  }

  openArchiveMemberModal(id: string, name: string, type: 'patient' | 'staff') {
    const modalRef = this.modalService.open(ArchiveMemberModal);
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.type = type;
  }

  handleMemberSelect(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.addMemberModalValue = element.value;
  }

  copyToClipboard(text?: string) {
    if (!text) return;
    if (this.copyStatusSubject.getValue() === 'copy') {
      this.clipboard.copy(text);
      this.copyStatusSubject.next('copied');
    }
  }

  generateShareableLink(
    type: 'staff' | 'patient',
    willExpireIn?: 'in1Day' | 'in1Week' | 'in2Weeks'
  ): string {
    // TODO: generate sharable link with the new expiry date
    return 'demo_link';
  }

  validateFields(type: 'patient' | 'staff'): boolean {
    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (type === 'patient') {
      console.log(this.patientDetails);
      if (
        !this.patientDetails.firstName ||
        !this.patientDetails.lastName ||
        !this.patientDetails.email ||
        !this.patientDetails.phoneNumber ||
        !this.patientDetails.phoneCountryCode
      ) {
        return false;
      } else if (!emailRegex.test(this.patientDetails.email)) {
        return false;
      } else if (
        !validatePhone(
          `${this.patientDetails.phoneCountryCode}${this.patientDetails.phoneNumber}`
        ).isValid
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      if (
        !this.staffDetails.firstName ||
        !this.staffDetails.lastName ||
        !this.staffDetails.email ||
        !this.staffDetails.phoneNumber ||
        !this.staffDetails.phoneCountryCode ||
        !this.staffDetails.staffType
      )
        return false;
      if (!emailRegex.test(this.staffDetails.email)) return false;
      if (
        !validatePhone(
          `${this.staffDetails.phoneCountryCode}${this.staffDetails.phoneNumber}`
        ).isValid
      ) {
        return false;
      }

      return true;
    }
  }

  setInput(
    type: 'patient' | 'staff',
    inputType: 'firstName' | 'lastName' | 'email' | 'phoneNumber',
    evt: Event
  ) {
    const element = evt.target as HTMLInputElement;
    if (type === 'patient') {
      this.patientDetails[inputType] = element.value;
      this.enableSaveButton = this.validateFields('patient');
    } else {
      this.staffDetails[inputType] = element.value;
      this.enableSaveButton = this.validateFields('staff');
    }
  }

  setSelect(
    type: 'patient' | 'staff',
    inputType: 'phoneCountryCode' | 'staffType',
    selectChange: MatSelectChange
  ) {
    if (type === 'patient') {
      if (inputType === 'staffType') return;
      this.patientDetails[inputType] = selectChange.value;
      this.enableSaveButton = this.validateFields('patient');
    } else {
      this.staffDetails[inputType] = selectChange.value;
      this.enableSaveButton = this.validateFields('staff');
    }
  }
}

@Component({
  selector: 'archive-member-modal',
  template: `
    <div class="py-4 px-8">
      <p class="h2 modal-title text-dark col-12">
        <i class="bi bi-exclamation-triangle-fill text-warning mx-3"></i>
        Archive
        {{ name }}
      </p>
    </div>

    <div class="px-8 mb-6">
      <p class="text-black col-12">
        Are you sure you want to remove this
        {{ type === 'staff' ? 'staff member' : type }} ?
      </p>
    </div>

    <div class="px-8 row mb-6">
      <div class="col-md-6"></div>
      <div class="col-md-6">
        <button
          class="btn btn-warning py-2 px-3"
          (click)="removeFromOrg(id, type)"
        >
          Remove
        </button>
        <button
          class="btn btn-secondary py-2 px-3 mx-4"
          ngbAutofocus
          (click)="activeModal.close('Cancel click')"
        >
          Cancel
        </button>
      </div>
    </div>
  `,
})
export class ArchiveMemberModal {
  @Input() name: string;
  @Input() id: string;
  @Input() type: 'patient' | 'staff';

  constructor(public activeModal: NgbActiveModal) {}
  removeFromOrg(id: string, type: 'patient' | 'staff') {
    console.log('remove:member:id::', id);
    if (type === 'patient') {
      // TODO: remove patient from the orgainzation
    } else {
      // TODO: remove patient from the orgainzation
    }
  }
}
