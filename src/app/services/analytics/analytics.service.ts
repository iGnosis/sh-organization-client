import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  baseURL: string = ''
  constructor(private http: HttpClient) {
    this.baseURL = environment.servicesEndpoint
  }

  getAnalytics(sessionIds: Array<string>) {
    return this.http.post(this.baseURL + '/analytics/session/data', { sessionIds })
  }
}
