import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { phone as validatePhone, PhoneResult } from 'phone';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss'],
})
export class AddStaffComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private gqlService: GraphqlService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.staffDetails.inviteCode = params['inviteCode'];
    });
  }

  private staffDetails: Partial<{
    firstName: string;
    lastName: string;
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
      inviteCode,
    } = this.staffDetails;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !phoneCountryCode ||
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
    this.staffDetails[type] = element.value;

    // enable save button only when all fields are validated
    this.enableSaveButton = this.validateFields();
  }

  setCountryCode(selectChange: MatSelectChange) {
    this.staffDetails['phoneCountryCode'] = selectChange.value;
    this.enableSaveButton = this.validateFields();
  }

  saveUserDetails() {
    if (!this.validateFields()) return;

    this.gqlService
      .gqlRequest(GqlConstants.CREATE_STAFF, {
        firstName: this.staffDetails.firstName,
        lastName: this.staffDetails.lastName,
        email: this.staffDetails.email,
        phoneNumber: this.staffDetails.phoneNumber,
        phoneCountryCode: this.staffDetails.phoneCountryCode,
        inviteCode: this.staffDetails.inviteCode,
      }, false)
      .then(() => {
        // TODO: redirect to orgPortal login ??
        console.log('Staff created successfully');
      })
      .catch((err) => {
        console.log('Error::', err);
      });
    console.log(this.staffDetails);
  }
}
