import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from 'src/app/pointmotion';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
  selector: 'latest-sessions',
  templateUrl: './latest-sessions.component.html',
  styleUrls: ['./latest-sessions.component.scss']
})
export class LatestSessionsComponent implements OnInit {
  dataSource = new MatTableDataSource();
  patients: Array<any>;

  displayedColumns: string[] = ['patient_name', 'last_session', 'sessions'];

  constructor(private graphqlService: GraphqlService) { }

  async ngOnInit(): Promise<void> {
    await this.loadPatientList();
    this.dataSource.data = await Promise.all(
      this.patients?.map(async (patient) => {
        const res = await this.loadLatestSessions(patient);
        return res;
      })
    );
  }

  async loadPatientList() {
    const response = await this.graphqlService.gqlRequest(GqlConstants.GET_TOP_PATIENTS);
    this.patients = response.patient;
  }

  async loadLatestSessions(patient: any) {
    if (!patient.games.length) return patient;

    const sessionDate = new Date(patient.games[0].createdAt);
    patient.lastSession = sessionDate;

    sessionDate.setHours(0,0,0,0);

    const response = await this.graphqlService.gqlRequest(GqlConstants.GET_LATEST_SESSIONS, {
      createdAt: sessionDate.toISOString(),
      patientId: patient.id,
    });

    patient.games = response.game.map((game: { game: string; id: string }) => {
      return {
        name: game.game.replace(/_/g, ' '),
        id: game.id,
      };
    });

    return patient;
  }

}
