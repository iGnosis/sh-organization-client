import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { JwtService } from 'src/app/services/jwt/jwt.service';

@Component({
  selector: 'app-add-organization',
  templateUrl: './add-organization.component.html',
  styleUrls: ['./add-organization.component.scss']
})
export class AddOrganizationComponent implements OnInit {
  organizationDetails = {
    name: '',
    type: 'clinic',
    adminEmail: '',
  };
  allowSavingChanges = false;
  allowRegistration = false;

  constructor(
    private graphqlService: GraphqlService, 
    private router: Router,
    private jwtService: JwtService,
  ) {}

  ngOnInit(): void {
  }

  validateForm() {
    const emailRegex = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
    const isEmailValid = emailRegex.test(this.organizationDetails.adminEmail);

    if (this.organizationDetails.adminEmail === '' || !isEmailValid || this.organizationDetails.name === '') {
      this.allowSavingChanges = false;
      this.allowRegistration = false;
    } else {
      this.allowSavingChanges = true;
      this.allowRegistration = true;
    }
  }

  async saveChanges() {
    const { organizationId, staffId } = this.getAdminDetails();
    if (organizationId === '' || staffId === '')  return;

    await this.graphqlService.gqlRequest(
      GqlConstants.EDIT_ORGANIZATION_DETAILS,
      {
        ...this.organizationDetails,
        organizationId,
        staffId,
      },
    );
    this.allowSavingChanges = false;
  }

  getAdminDetails(): {
    organizationId: string;
    staffId: string;
  } {
    const jwtDecoded: { [key: string]: any } = jwtDecode(this.jwtService.getToken() || '');

    const hasDetails = 'https://hasura.io/jwt/claims' in jwtDecoded;
    if (!hasDetails) return { organizationId: '', staffId: '' };

    const jwtData = jwtDecoded['https://hasura.io/jwt/claims'];
    const organizationId = jwtData['x-hasura-organization-id'];
    const staffId = jwtData['x-hasura-user-id'];

    return { organizationId, staffId };
  }

  async registerOrganization() {
    const unsavedChangesExist = this.allowSavingChanges;
    if (unsavedChangesExist)
      await this.saveChanges();
    this.router.navigate(['/app/admin']);
  }

}
