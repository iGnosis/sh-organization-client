import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionData, IChart } from 'src/app/types/chart';
import { environment } from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class ChartService {

  baseURL: string = ''
  constructor(private http: HttpClient) {
    this.baseURL = environment.servicesEndpoint
  }

  // getChartData(sessionId: string) {
  //   return this.http.post(this.baseURL + '/analytics/activity/reaction-time-chart', { sessionId })
  // }

  getEngagementPerPatient(patientId: string, startDate: string, endDate: string) {
    return this.http.post(this.baseURL + '/analytics/patient/engagement-ratio', {
      patientId,
      startDate,
      endDate
    })
  }

  getAchievementPerPatient(patientId: string, startDate: string, endDate: string) {
    return this.http.post(this.baseURL + '/analytics/patient/achievement-ratio', {
      patientId,
      startDate,
      endDate
    })
  }

  // here, we do things that are painful to do with plain SQL.
  transformifyData(chartResults: IChart[]): SessionData {
    let patientObject: any = {}

    // build session
    for (const item of chartResults) {
      if (item.session) {
        patientObject[item.session] = {}
      }
    }

    // build activity
    for (const sessionId in patientObject) {
      // console.log(session)
      for (const item of chartResults) {
        if (sessionId == item.session && item.activity) {
          patientObject[sessionId][item.activity] = {}
        }
      }
    }

    // build events
    for (const sessionId in patientObject) {
      for (const activityId in patientObject[sessionId]) {
        for (const item of chartResults) {
          if (sessionId == item.session && activityId == item.activity) {

            if (patientObject[sessionId][activityId].events == undefined) {
              patientObject[sessionId][activityId]['events'] = []
            }

            patientObject[sessionId][activityId]['events'].push({
              activityName: item.activity_name,
              taskName: item.task_name,
              reactionTime: item.reaction_time,
              createdAt: item.created_at,
              score: item.score
            })

          }
        }
      }
    }
    console.log('chart.service:tranformifyData:', patientObject)
    return patientObject
  }
}
