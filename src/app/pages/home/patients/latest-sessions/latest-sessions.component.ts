import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { groupBy, uniqBy } from 'lodash';
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
    this.dataSource.data = this.patients;
  }

  async loadPatientList() {
    const response = await this.graphqlService.gqlRequest(GqlConstants.GET_LATEST_GAMES, {
      limit: 10,
      offset: 0,
    });
    const groupByPatient = groupBy(response.game, 'patientByPatient.id');

    Object.keys(groupByPatient).forEach((key) => {
      groupByPatient[key] = uniqBy(groupByPatient[key], 'game');
    });

    this.patients = Object.entries(groupByPatient).map((entry: any) => {
      const [key, value] = entry;
      return {
        id: key,
        nickname: value[0]?.patientByPatient.nickname,
        firstName: value[0]?.patientByPatient.firstName,
        lastName: value[0]?.patientByPatient.lastName,
        games: value.map((game: any) => ({
          id: game.id,
          name: game.game.replace(/_/g, ' '),
          createdAt: game.createdAt,
        })),
      }
    });
  }
}
