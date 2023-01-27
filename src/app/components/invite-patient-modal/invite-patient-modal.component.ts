import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
  selector: 'invite-patient-modal',
  templateUrl: './invite-patient-modal.component.html',
  styleUrls: ['./invite-patient-modal.component.scss'],
})
export class InvitePatientModalComponent implements OnInit {
  @Input() modal: any;
  @Input() modalState: Subject<boolean>;
  patientEmail: string;
  shareableLink: string;
  copyStatusSubject: BehaviorSubject<string> = new BehaviorSubject('copy');
  toggleLinkExpiry = false;
  expiryDate: any;

  throttledSendInviteViaEmail: (...args: any[]) => void;
  constructor(
    private gqlService: GraphqlService,
    private clipboard: Clipboard
  ) {
    this.throttledSendInviteViaEmail = this.throttle(() => {
      this.sendInviteViaEmail();
    }, 1000);
  }

  ngOnInit(): void {
    this.modalState.subscribe((state) => {
      if (state) {
        this.generateShareableLink();
      } else {
        this.shareableLink = '';
      }
    });
    this.copyStatusSubject.subscribe((status) => {
      if (status === 'copied') {
        setTimeout(() => {
          this.copyStatusSubject.next('copy');
        }, 1000);
      }
    });
  }

  copyToClipboard(text?: string) {
    if (!text) return;
    if (this.copyStatusSubject.getValue() === 'copy') {
      this.clipboard.copy(text);
      this.copyStatusSubject.next('copied');
    }
  }

  async sendInviteViaEmail() {
    try {
      await this.gqlService.client.request(GqlConstants.INVITE_PATIENT, {
        shouldSendEmail: true,
        email: this.patientEmail,
      });
      this.modal.dismissAll();
    } catch (err) {
      console.log('Error::', err);
    } finally {
    }
  }

  async generateShareableLink() {
    try {
      const code = await this.gqlService.client.request(
        GqlConstants.INVITE_PATIENT,
        {}
      );
      this.shareableLink = `${window.location.origin}/invite/patient?inviteCode=${code.invitePatient.data.inviteCode}`;
    } catch (err) {
      console.log('Error::', err);
      return err;
    }
  }

  throttle(fn: any, wait = 500) {
    let isCalled = false;
    return function (...args: any[]) {
      if (!isCalled) {
        fn(...args);
        isCalled = true;
        setTimeout(function () {
          isCalled = false;
        }, wait);
      }
    };
  }
}
