import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GqlConstants } from '../gql-constants/gql-constants.constants';
import { GraphqlService } from '../graphql/graphql.service';

type ChartTypeEnum =
  | 'avgAchievementRatio'
  | 'avgCompletionTime'
  | 'avgEngagementRatio';
type GroupByEnum = 'day' | 'week' | 'month';
@Injectable({
  providedIn: 'root',
})
export class ChartService {
  baseURL = '';
  constructor(private http: HttpClient, private gqlService: GraphqlService) {
    this.baseURL = environment.servicesEndpoint;
  }

  // getChartData(sessionId: string) {
  //   return this.http.post(this.baseURL + '/analytics/activity/reaction-time-chart', { sessionId })
  // }

  fetchPatientChartableData(
    startDate: string,
    endDate: string,
    userTimezone: string,
    patientId: string,
    chartType: ChartTypeEnum,
    groupBy: GroupByEnum,
    isGroupByGames: boolean,
  ) {
    return this.gqlService.gqlRequest(
      GqlConstants.GET_PATIENT_CHARTS,
      {
        startDate,
        endDate,
        userTimezone,
        patientId,
        chartType,
        groupBy,
        isGroupByGames,
      },
      true
    );
  }

  fetchPatientMonthlyCompletionData(
    startDate: string,
    endDate: string,
    userTimezone: string,
    sortBy: string,
    sortDirection: string,
    limit: string,
    offset: string,
    showInactive: boolean
  ) {
    return this.gqlService.gqlRequest(
      GqlConstants.GET_PATIENT_MONTHLY_COMPLETION,
      {
        startDate,
        endDate,
        userTimezone,
        sortBy,
        sortDirection,
        limit,
        offset,
        showInactive,
      },
      true
    );
  }

  async patientMoodVariationChart(startDate: Date, endDate: Date, patientId: string): Promise<Array<{
    createdAt: string;
    mood: string;
  }>> {
    const resp = await this.gqlService.client.request(GqlConstants.GET_PATIENT_MOOD, { startDate, endDate, patientId });
    return resp.checkin;
  }
}
