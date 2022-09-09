import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IChart, SessionData } from 'src/app/pointmotion';
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
    isGroupByGames: boolean
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


  // here, we do things that are painful to do with plain SQL.
  transformifyData(chartResults: IChart[]): SessionData {
    const patientObject: any = {};

    // build session
    for (const item of chartResults) {
      if (item.session) {
        patientObject[item.session] = {};
      }
    }

    // build activity
    for (const sessionId in patientObject) {
      // console.log(session)
      for (const item of chartResults) {
        if (sessionId == item.session && item.activity) {
          patientObject[sessionId][item.activity] = {};
        }
      }
    }

    // build events
    for (const sessionId in patientObject) {
      for (const activityId in patientObject[sessionId]) {
        for (const item of chartResults) {
          if (sessionId == item.session && activityId == item.activity) {
            if (patientObject[sessionId][activityId].events == undefined) {
              patientObject[sessionId][activityId]['events'] = [];
            }

            patientObject[sessionId][activityId]['events'].push({
              activityName: item.activity_name,
              taskName: item.task_name,
              reactionTime: item.reaction_time,
              createdAt: item.created_at,
              score: item.score,
            });
          }
        }
      }
    }
    console.log('chart.service:tranformifyData:', patientObject);
    return patientObject;
  }
}
