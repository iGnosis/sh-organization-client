import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { phone as validatePhone } from 'phone';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
})
export class AddPatientComponent implements OnInit {

  isPhoneTaken = false;
  isEmailTaken = false;

  constructor(
    private route: ActivatedRoute,
    private gqlService: GraphqlService
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.patientDetails.inviteCode = params['inviteCode'];
    });
  }

  private patientDetails: Partial<{
    firstName: string;
    lastName: string;
    namePrefix: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode: string;
    inviteCode: string;
  }> = {};

  enableSaveButton = false;

  validateFields(): boolean {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      phoneCountryCode,
      namePrefix,
      inviteCode,
    } = this.patientDetails;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !phoneCountryCode ||
      !namePrefix ||
      !inviteCode
    )
      return false;

    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!emailRegex.test(email)) return false;

    if (!validatePhone(`${phoneCountryCode}${phoneNumber}`).isValid)
      return false;

    return true;
  }

  setInput(
    type: 'firstName' | 'lastName' | 'email' | 'phoneNumber',
    evt: Event
  ) {
    const element = evt.target as HTMLInputElement;
    this.patientDetails[type] = element.value;

    this.enableSaveButton = this.validateFields();
  }

  setSelect(
    type: 'namePrefix' | 'phoneCountryCode',
    selectChange: MatSelectChange
  ) {
    this.patientDetails[type] = selectChange.value;

    this.enableSaveButton = this.validateFields();
  }

  async saveUserDetails() {
    if (!this.validateFields()) return;
    const resp = await this.gqlService.gqlRequest(GqlConstants.CREATE_PATIENT, {
        firstName: this.patientDetails.firstName,
        lastName: this.patientDetails.lastName,
        namePrefix: this.patientDetails.namePrefix,
        email: this.patientDetails.email,
        phoneCountryCode: this.patientDetails.phoneCountryCode,
        phoneNumber: this.patientDetails.phoneNumber,
        inviteCode: this.patientDetails.inviteCode,
      }, false);

      if (resp.toString().toLowerCase().includes('email address already taken')) {
        this.isEmailTaken = true;
        this.isPhoneTaken = false;
        return;
    } else if (resp.toString().toLowerCase().includes('phone number already taken')) {
        this.isEmailTaken = false;
        this.isPhoneTaken = true;
        return;
    }
  }
}
