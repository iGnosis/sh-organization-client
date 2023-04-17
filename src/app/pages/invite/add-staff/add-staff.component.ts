import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { phone as validatePhone } from 'phone';
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
    private gqlService: GraphqlService,
    private router: Router,
    private _snackBar: MatSnackBar,
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
        this._snackBar.open('Staff created successfully. Redirecting... ', undefined, {
          duration: 2000,
        });
        console.log('Staff created successfully');
        setTimeout(() => {
          this.router.navigate(['/public/auth/sign-in']);
        }, 2000);
      })
      .catch((err) => {
        console.log('Error::', err);
      });
  }
}
