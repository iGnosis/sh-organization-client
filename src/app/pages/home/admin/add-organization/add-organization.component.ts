import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
  selector: 'app-add-organization',
  templateUrl: './add-organization.component.html',
  styleUrls: ['./add-organization.component.scss']
})
export class AddOrganizationComponent implements OnInit {
  adminDetails = {
    email: '',
    phoneCountryCode: '+1',
    phoneNumber: '',
  };
  organizationDetails = {
    name: '',
    type: 'clinic',
  };
  inviteCode = '';
  allowSavingChanges = false;

  constructor(private graphqlService: GraphqlService, private router: Router, private route: ActivatedRoute) {
    this.inviteCode = this.route.snapshot.paramMap.get('inviteCode') || '';
  }

  ngOnInit(): void {
  }

  validateForm() {
    const emailRegex = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
    const isEmailValid = emailRegex.test(this.adminDetails.email);
    const isPhoneNoValid = /^\d+$/.test(this.adminDetails.phoneNumber);

    if (this.adminDetails.email === '' || !isEmailValid || !isPhoneNoValid || this.adminDetails.phoneNumber === '' || this.organizationDetails.name === '') {
      this.allowSavingChanges = false;
    } else {
      this.allowSavingChanges = true;
    }
  }

  async saveChanges() {
    await this.graphqlService.gqlRequest(
      GqlConstants.CREATE_ORGANIZATION,
      {
        createOrganizationInput: {
          adminDetails: this.adminDetails,
          orgDetails: this.organizationDetails,
          inviteCode: this.inviteCode,
        }
      }
    );
  }

  async registerOrganization() {
    await this.saveChanges();
    this.router.navigate(['/app/admin']);
  }

}
