import { Component, Input, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { phone as validatePhone } from 'phone';
import { Subject } from 'rxjs';

@Component({
  selector: 'add-patient-modal',
  templateUrl: './add-patient-modal.component.html',
  styleUrls: ['./add-patient-modal.component.scss']
})
export class AddPatientModalComponent implements OnInit {
  @Input() modal: any;
  @Input() modalState: Subject<boolean>;
  patientDetails: Partial<{
    firstName: string;
    lastName: string;
    namePrefix: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode: string;
  }> = {};
  addNewPatientStatus: Partial<{ status: 'success' | 'error'; text: string }> =
    {};
  enableSaveButton = false;
  constructor(private gqlService: GraphqlService) {
  }

  ngOnInit(): void {
    this.modalState.subscribe((state) => {
      if (!state) {
        this.patientDetails = {};
        this.validateFields();
      }
    });
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

  setInput(
    inputType: 'firstName' | 'lastName' | 'email' | 'phoneNumber',
    evt: Event
  ) {
    const element = evt.target as HTMLInputElement;
    this.patientDetails[inputType] = element.value;
    this.enableSaveButton = this.validateFields();
  }

  setSelect(
    inputType: 'phoneCountryCode' | 'staffType' | 'namePrefix',
    selectChange: MatSelectChange
  ) {
    if (inputType === 'staffType') return;
    this.patientDetails[inputType] = selectChange.value;
    this.enableSaveButton = this.validateFields();
  }

  validateFields(): boolean {
    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

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
  }

}
