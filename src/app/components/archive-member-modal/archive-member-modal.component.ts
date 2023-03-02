import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GraphQLError } from 'graphql';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
  selector: 'app-archive-member-modal',
  templateUrl: './archive-member-modal.component.html',
  styleUrls: ['./archive-member-modal.component.scss'],
})
export class ArchiveMemberModalComponent implements OnInit {
  constructor(
    public activeModal: NgbActiveModal,
    private gqlSevice: GraphqlService
  ) {}

  @Input() name: string;
  @Input() id: string;
  @Input() type: 'patient' | 'staff';

  ngOnInit(): void {}

  async archiveFromOrg(
    id: string,
    type: 'patient' | 'staff'
  ): Promise<number | GraphQLError> {
    if (type === 'patient') {
      try {
        const archivedId: { update_patient_by_pk: { id: number } } =
          await this.gqlSevice.client.request(GqlConstants.ARCHIVE_PATIENT, {
            patientId: id,
          });
        this.activeModal.close('Archive click');
        return archivedId.update_patient_by_pk.id;
      } catch (err) {
        console.log(err);
        return err;
      }
    } else {
      try {
        const archivedId: { update_staff_by_pk: { id: number } } =
          await this.gqlSevice.client.request(GqlConstants.ARCHIVE_STAFF, {
            staffId: id,
          });
        this.activeModal.close('Archive click');
        return archivedId.update_staff_by_pk.id;
      } catch (err) {
        console.log(err);
        return err;
      }
    }
  }
}
