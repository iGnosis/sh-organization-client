import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Clipboard } from '@angular/cdk/clipboard';
import { BehaviorSubject, timeout } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { phone as validatePhone } from 'phone';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphQLError } from 'graphql-request/dist/types';
import { ArchiveMemberModalComponent } from 'src/app/components/archive-member-modal/archive-member-modal.component';

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
  staffList: {
    firstName: string;
    lastName: string;
    id: string;
    type: string;
  }[];

  patientList: {
    firstName: string;
    lastName: string;
    id: string;
    email: string;
  }[];

  patientDetails: Partial<{
    firstName: string;
    lastName: string;
    namePrefix: string;
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
    staffType: 'org_admin' | 'therapist';
  }> = {};

  constructor(
    private modalService: NgbModal,
    private clipboard: Clipboard,
    private gqlService: GraphqlService
  ) {}

  ngOnInit(): void {
    this.initTables();

    this.copyStatusSubject.subscribe((status) => {
      if (status === 'copied') {
        setTimeout(() => {
          this.copyStatusSubject.next('copy');
        }, 1000);
      }
    });
  }

  async initTables() {
    const staff = await this.gqlService.client.request(GqlConstants.GET_STAFF);
    console.log(staff);
    this.staffList = staff.staff;

    const patients = await this.gqlService.client.request(
      GqlConstants.GET_PATIENTS
    );
    this.patientList = patients.patient;
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

  addNewStaffStatus: Partial<{ status: 'success' | 'error'; text: string }> =
    {};
  addNewPatientStatus: Partial<{ status: 'success' | 'error'; text: string }> =
    {};

  async addNewStaff() {
    try {
      await this.gqlService.client.request(GqlConstants.CREATE_NEW_STAFF, {
        firstName: this.staffDetails.firstName,
        lastName: this.staffDetails.lastName,
        email: this.staffDetails.email,
        phoneNumber: this.staffDetails.phoneNumber,
        phoneCountryCode: this.staffDetails.phoneCountryCode,
        type: this.staffDetails.staffType,
      });

      this.addNewStaffStatus = {
        status: 'success',
        text: 'Added new staff member successfully.',
      };

      setTimeout(() => {
        this.addNewStaffStatus = {};
      }, 3000);

      this.staffDetails = {};
    } catch (err) {
      console.log('Error::', err);
      this.addNewStaffStatus = {
        status: 'error',
        text: 'Failed to add new staff member.',
      };
      setTimeout(() => {
        this.addNewStaffStatus = {};
      }, 3000);
    }
  }

  async addNewPatient() {
    try {
      await this.gqlService.client.request(GqlConstants.CREATE_NEW_PATIENT, {
        firstName: this.patientDetails.firstName,
        lastName: this.patientDetails.lastName,
        email: this.patientDetails.email,
        phoneNumber: this.patientDetails.phoneNumber,
        phoneCountryCode: this.patientDetails.phoneCountryCode,
        namePrefix: this.patientDetails.namePrefix,
      });

      this.addNewPatientStatus = {
        status: 'success',
        text: 'Added new Patient successfully.',
      };

      setTimeout(() => {
        this.addNewPatientStatus = {};
      }, 3000);

      this.patientDetails = {};
    } catch (err) {
      console.log('Error::', err);
      this.addNewPatientStatus = {
        status: 'error',
        text: 'Failed to add new Patient.',
      };
      setTimeout(() => {
        this.addNewPatientStatus = {};
      }, 3000);
    }
  }

  openArchiveMemberModal(id: string, name: string, type: 'patient' | 'staff') {
    const modalRef = this.modalService.open(ArchiveMemberModalComponent);
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
        !this.patientDetails.phoneCountryCode ||
        !this.patientDetails.namePrefix
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
    inputType: 'phoneCountryCode' | 'staffType' | 'namePrefix',
    selectChange: MatSelectChange
  ) {
    if (type === 'patient') {
      if (inputType === 'staffType') return;
      this.patientDetails[inputType] = selectChange.value;
      this.enableSaveButton = this.validateFields('patient');
    } else {
      if (inputType === 'namePrefix') return;
      this.staffDetails[inputType] = selectChange.value;
      this.enableSaveButton = this.validateFields('staff');
    }
  }
}
