import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { phone as validatePhone } from 'phone';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  userType: 'staff' | 'patient';
  userId: string;

  constructor(
    private route: ActivatedRoute,
    private gqlService: GraphqlService
  ) { }

  enableSaveButton = false;
  isEditable = false;

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
    type: 'org_admin' | 'therapist';
  }> = {};

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const edit: boolean = params['edit'];
      if (edit) {
        this.isEditable = edit;
      }
    });
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const userId: string | null = params.get('id');
      const userType: ('staff' | 'patient') | null = params.get('type') as
        | 'staff'
        | 'patient';
      if (!userId || !userType) {
        // TODO: give feedback that the url is invalid.
        console.log('Invalid params');
        return;
      }
      this.userId = userId;
      this.userType = userType;

      if (userType === 'patient') {
        const patientDetails = await this.gqlService.client.request(
          GqlConstants.GET_PATIENT_BY_PK,
          {
            id: userId,
          }
        );
        this.patientDetails = patientDetails.patient_by_pk;
      } else {
        const staffDetails = await this.gqlService.client.request(
          GqlConstants.GET_STFF_BY_PK,
          {
            id: userId,
          }
        );
        this.staffDetails = staffDetails.staff_by_pk;
      }
    });
  }

  validateFields(type: 'staff' | 'patient'): boolean {
    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (type === 'patient') {
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
        !this.staffDetails.type
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
    inputType: 'phoneCountryCode' | 'type' | 'namePrefix',
    selectChange: MatSelectChange
  ) {
    if (type === 'patient') {
      if (inputType === 'type') return;
      this.patientDetails[inputType] = selectChange.value;
      this.enableSaveButton = this.validateFields('patient');
    } else {
      if (inputType === 'namePrefix') return;
      this.staffDetails[inputType] = selectChange.value;
      this.enableSaveButton = this.validateFields('staff');
    }
  }

  async updatePatientDetails() {
    try {
      await this.gqlService.client
        .request(GqlConstants.UPDATE_PATIENT_BY_PK, {
          id: this.userId,
          ...this.patientDetails,
        })
        .then(() => {
          this.isEditable = false;
          // TODO: make sure the local values of patient are being updated.
        });
    } catch (err) {
      console.log('Error::', err);
    }
  }

  async updateStaffDetails() {
    try {
      await this.gqlService.client
        .request(GqlConstants.UPDATE_STAFF_BY_PK, {
          id: this.userId,
          ...this.staffDetails,
        })
        .then(() => {
          this.isEditable = false;
          // TODO: make sure the local values of staff is being updated.
        });
    } catch (err) {
      console.log('Error::', err);
    }
  }
}
