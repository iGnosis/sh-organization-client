import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { Session } from 'src/app/pointmotion';
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  baseURL = ''
  constructor(private http: HttpClient) {
    this.baseURL = environment.servicesEndpoint
  }

  getAnalytics(sessionIds: Array<string>) {
    return this.http.post(this.baseURL + '/analytics/session/data', { sessionIds })
  }

  getSessionCompletionRatio(sessionId: string) {
    return this.http.post(this.baseURL + '/analytics/session/engagement-ratio', {
      sessionId
    })
  }

  calculateTimeDuration(createdAt: Date, endedAt: Date) {
    const createdAtMilliSec: number = new Date(createdAt).getTime()
    const endedAtMilliSec: number = new Date(endedAt).getTime()
    const seconds = (endedAtMilliSec - createdAtMilliSec) / 1000
    const numMinutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60)
    return `${numMinutes} minutes`
  }
}
