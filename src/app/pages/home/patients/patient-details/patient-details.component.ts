import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { Patient } from 'src/app/types/patient';
import { Session } from 'src/app/types/session';
import { environment } from 'src/environments/environment';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {

  itemsPerPage = 10
  currentPage = 1
  isRowsChecked = false
  achievementChart: any
  engagementChart: any
  selectedSessionChart: any

  patientId?: string
  details?: Patient
  totalSessionsCount?: number
  sessionDetails?: Array<Session>

  // sessionDetails = [
  //   {
  //     id: '2d01273f-d40b-42d7-bfdb-76843668accb', // sessionId
  //     carePlan: 'Music and Movement',
  //     activityType: 'Physical',
  //     timeDuration: '20 minutes',
  //     createdDate: 'Jan 20, 2022',
  //     performance: 70
  //   },
  //   {
  //     id: '2d01273f-1234-42d7-bfdb-76843668accb', // sessionId
  //     carePlan: 'Cognitive Skills',
  //     activityType: 'Memory',
  //     timeDuration: '15 minutes',
  //     createdDate: 'Jan 24, 2022',
  //     performance: 45
  //   }
  // ]


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private analyticsService: AnalyticsService,
    private graphqlService: GraphqlService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.patientId = params.get('id') || ''
      if (this.patientId) {
        console.log('patientId:', this.patientId);
        this.fetchSessions(0)

        // init dummy charts
        this.selectedSessionChart = 'Mind - Body Connection'
        this.initAchievementChart()
        this.initEngagementChart()
      }
    })
  }

  async fetchSessions(offset: number) {
    // we need to show sessions of a patient.
    let sessions = await this.graphqlService.client.request(GqlConstants.GET_SESSIONS,
      {
        patientId: this.patientId,
        limit: this.itemsPerPage,
        offset
      }
    )
    console.log('offset:', offset)
    console.log('fetchSessions:', sessions)
    const totalSessionsCount = sessions.session_aggregate.aggregate.count
    console.log('fetchSessions:totalSessionsCount:', totalSessionsCount)
    this.totalSessionsCount = totalSessionsCount

    // Array of sessions
    sessions = sessions.session

    if (!sessions) return

    sessions.forEach((val: Session) => {
      // work out time duration
      if (val.createdAt && val.endedAt) {
        const createdAtMilliSec: number = new Date(val.createdAt).getTime()
        const endedAtMilliSec: number = new Date(val.endedAt).getTime()
        const seconds = (endedAtMilliSec - createdAtMilliSec) / 1000
        val.timeDuration = this.secondsToString(seconds)
      }
    })

    this.sessionDetails = sessions

    // fetching analytics data for sessions
    const sessionIds = sessions.map((session: Session) => session.id)
    console.log('fetchSessions:sessionIds:', sessionIds)

    this.analyticsService.getAnalytics(sessionIds).subscribe((sessionAnalytics: any) => {
      console.log('fetchSessions:getAnalytics:', sessionAnalytics)

      sessions.forEach((val: Session) => {
        if (val.id && val.id in sessionAnalytics) {
          let performanceRatio = 0
          let totalEventsPerSession = 0
          let avgReactionTime = 0

          const session = sessionAnalytics[val.id]
          val.sessionAnalytics = session

          for (const activity in session) {
            for (const event of session[activity].events) {
              // console.log('event:', event)
              performanceRatio += event.score * 100
              avgReactionTime += event.reactionTime
              totalEventsPerSession++
            }
          }
          performanceRatio = performanceRatio / totalEventsPerSession
          performanceRatio = Math.round(performanceRatio * 100) / 100
          val.totalPerformanceRatio = performanceRatio
          val.avgReactionTime = parseFloat((avgReactionTime / totalEventsPerSession).toFixed(2))
        }
      })

      this.sessionDetails = sessions
      console.log('sessionDetails:', this.sessionDetails)
    })
  }

  async createNewSessionAndRedirect() {
    const sessionId = await this.createNewSession()
    this.goToLink(`${environment.activityEndpoint}?sessionId=${sessionId}`)
  }

  async createNewSession() {
    const session = await this.graphqlService.client.request(GqlConstants.CREATE_SESSION, { patient: this.patientId, careplan: '4e2aa726-b07f-4f44-a4fd-fc228c93bfc7' })
    if (
      session &&
      session.insert_session &&
      session.insert_session.returning &&
      Array.isArray(session.insert_session.returning) &&
      session.insert_session.returning.length == 1 &&
      session.insert_session.returning[0].id
    ) {
      const sessionId = session.insert_session.returning[0].id
      console.log('createSessionAndRedirect:sessionId', sessionId)
      return sessionId
    }
  }

  goToLink(url: string) {
    console.log(`goToLink:Redirecting user to ${url}...`)
    window.open(url, '_blank')
  }

  initEngagementChart() {
    const data = {
      labels: ['28th', '29th', '30th', '31st', '1st', '2nd', '3rd'],
      datasets: [{
        data: [86, 48, 100, 79, 0, 100, 0],
        backgroundColor: '#000066',
        fill: true,
        label: 'Completion Ratio'
      }]
    }

    const config = {
      type: 'bar',
      data: data,
      plugins: [ChartDataLabels],
      options: {
        beginAtZero: true,
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Session Completion',
              font: {
                size: 18
              },
              padding: 12
            },
            ticks: {
              callback: (value: number) => `${value}%`,
              font: {
                size: 14
              },
              color: '#000066'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Day',
              font: {
                size: 18
              },
              padding: 12
            },
            ticks: {
              font: {
                size: 14
              },
              color: '#000066'
            }
          }
        },
        plugins: {
          // hide Label 'success ratio'
          legend: {
            display: false
          },
          datalabels: {
            anchor: 'end',
            align: 'start',
            offset: 10,
            color: 'white',
            font: {
              size: 14
            }
          },
          title: {
            display: false,
            align: 'center',
            text: 'Reaction Time',
            fullSize: true,
            font: {
              size: 28
            }
          }
        }
      }
    }

    // @ts-ignore: TypeScript headache - fix later
    const ctx = document.getElementById('engagementChart').getContext('2d')
    if (ctx) {
      // @ts-ignore: TypeScript headache - fix later
      this.engagementChart = new Chart(ctx, config)
    }
  }

  initAchievementChart() {
    const data = {
      labels: ['28th', '29th', '30th', '31st'],
      datasets: [{
        // data: [60, 82, 75, 80, 68, 77, 90],
        data: [
          {
            'id': '28th', data: {
              'allSessions': 55
            }
          },
          {
            'id': '29th', data: {
              'allSessions': 86
            }
          },
          {
            'id': '30th', data: {
              'allSessions': 90
            }
          },
          {
            'id': '31st', data: {
              'allSessions': 78
            }
          }
        ],
        backgroundColor: '#000066',
        borderColor: '#000066',
        pointBackgroundColor: '#000066',
        radius: 5,
        tension: 0.1,
        fill: false,
        label: 'Success Ratio'
      }]
    }

    const config = {
      type: 'line',
      data: data,
      options: {
        hitRadius: 30,
        hoverRadius: 12,
        responsive: true,
        // making object array readable for ChartJS
        parsing: {
          xAxisKey: 'id',
          yAxisKey: 'data.allSessions'
        },
        scales: {
          y: {
            // set max percentage for chart
            max: 100,
            // set min percentage for chart
            beginAtZero: true,
            title: {
              display: true,
              text: '% of correct motions',
              font: {
                size: 18
              },
              padding: 12
            },
            ticks: {
              callback: (value: number) => `${value}%`,
              font: {
                size: 14
              },
              color: '#000066'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Day',
              font: {
                size: 18
              },
              padding: 12
            },
            ticks: {
              font: {
                size: 14
              },
              color: '#000066'
            }
          }
        },
        plugins: {
          // hide Label 'success ratio'
          legend: {
            display: false
          },
          title: {
            display: false,
            align: 'center',
            text: 'Achievement Ratio:',
            fullSize: true,
            font: {
              size: 28
            }
          }
        }
      }
    }

    // @ts-ignore: TypeScript headache - fix later
    const ctx = <HTMLCanvasElement>document.getElementById('achievementChart').getContext('2d')!
    if (ctx) {
      // @ts-ignore: TypeScript headache - fix later
      this.achievementChart = new Chart(ctx, config)
    }
  }

  secondsToString(seconds: number): string {
    const numMinutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60)
    return `${numMinutes} minutes`
  }

  toogleRowsCheck() {
    const formCheckinputs = document.querySelectorAll('.row-check-input')
    if (this.isRowsChecked) {
      formCheckinputs.forEach(arr => {
        arr.removeAttribute('checked')
      })
    } else {
      formCheckinputs.forEach(arr => {
        arr.setAttribute('checked', '')
      })
    }
    this.isRowsChecked = !this.isRowsChecked
  }

  async pageChanged(pageNumber: any) {
    console.log('pageChanged:', pageNumber)
    await this.fetchSessions((pageNumber - 1) * this.itemsPerPage)
    this.currentPage = pageNumber
  }

  changeSessionsChart() {
    const sessionVal = (<HTMLInputElement>document.getElementById('sessionVal')).value
    console.log('changeFinancials:', sessionVal)
    this.achievementChart.config.options.parsing.yAxisKey = `data.${sessionVal}`
    this.achievementChart.update()
  }

  openSessionDetailsPage(sessionId: string, sessionDetails: any) {
    this.router.navigate(['/app/sessions/', sessionId], { queryParams: { sessionDetails: JSON.stringify(sessionDetails) } })
  }
}
