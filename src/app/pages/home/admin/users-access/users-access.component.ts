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

@Component({
  selector: 'app-users-access',
  templateUrl: './users-access.component.html',
  styleUrls: ['./users-access.component.scss'],
})
export class UsersAccessComponent implements OnInit {
  addMemberModalValue: string | undefined = undefined;
  @ViewChild('addMemberModal') addMemberModal: TemplateRef<any>;
  @ViewChild('addNewPatient') addNewPatientModal: TemplateRef<any>;
  @ViewChild('addNewStaff') addNewStaffModal: TemplateRef<any>;

  copyStatusSubject = new BehaviorSubject<'copy' | 'copied'>('copy');
  shareableLink: string | undefined = undefined;

  addMemberModalRef: NgbActiveModal;
  toggleLinkExpiry = false;
  expiryDate: string | undefined = undefined;

  // TODO: fetch data from the backend
  adminList = [
    { name: 'Arbor Acres', role: 'Org Admin', id: 'some_uuid' },
    { name: 'Leia', role: 'Org Admin', id: 'some_uuid' },
    { name: 'Ethan Hunt', role: 'Org Admin', id: 'some_uuid' },
  ];

  patientList = [
    { name: 'Benjamin', role: 'Org Admin', id: 'some_uuid' },
    { name: 'Anakin', role: 'Org Admin', id: 'some_uuid' },
    { name: 'Luke', role: 'Org Admin', id: 'some_uuid' },
  ];

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

  openAddNewPatientModal() {
    this.addMemberModalRef && this.addMemberModalRef.dismiss();
    this.generateShareableLink();
    this.modalService.open(this.addNewPatientModal, {
      size: 'lg',
      beforeDismiss: () => {
        this.shareableLink = undefined;
        return true;
      },
    });
  }

  openAddNewStaffModal(type?: 'staff' | 'admin') {
    this.addMemberModalRef && this.addMemberModalRef.dismiss();
    this.generateShareableLink();
    this.modalService.open(this.addNewStaffModal, {
      size: 'lg',
      beforeDismiss: () => {
        this.shareableLink = undefined;
        return true;
      },
    });
  }

  openRemoveMemberModal(id: string, name: string, type: 'patient' | 'staff') {
    const modalRef = this.modalService.open(RemoveMemberModal);
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

  generateShareableLink() {
    //TODO: generate sharable link from the backend
  }

  regenerateSharableLink(willExpireIn: 'in1Day' | 'in1Week' | 'in2Weeks') {
    // TODO: regenerate sharable link with the new expiry date
  }
}

@Component({
  selector: 'remove-member-modal',
  template: `
    <div class="py-4 px-8">
      <p class="h2 modal-title text-dark col-12">Remove {{ name }}</p>
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
          class="btn btn-danger py-2 px-3"
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
export class RemoveMemberModal {
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
