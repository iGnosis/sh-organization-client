import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  baseURL: string = ''
  constructor(private http: HttpClient) {
    this.baseURL = environment.servicesEndpoint
  }

  getChartData(sessionId: string) {
    return this.http.post(this.baseURL+'/analytics/activity/reaction-time-chart', {sessionId})
  }
}
