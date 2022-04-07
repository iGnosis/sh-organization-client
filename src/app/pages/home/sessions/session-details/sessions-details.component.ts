import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChartService } from 'src/app/services/chart/chart.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { ChartSessionData } from 'src/app/types/chart';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Session } from 'src/app/types/session';


@Component({
  selector: 'app-sessions-details',
  templateUrl: './sessions-details.component.html',
  styleUrls: ['./sessions-details.component.scss']
})
export class SessionsDetailsComponent implements OnInit {

  showCharts = false

  // holds current sessionId
  sessionId?: string

  // holds the user sessions, so we can show them on a table
  sessions?: Session[]

  // works out whether to show session table or not
  showSessionsTable?: Boolean

  // data that is passed into Chart init functions
  // so we can render the charts
  chartData?: ChartSessionData

  constructor(private route: ActivatedRoute, private chartService: ChartService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.sessionId = params.get('id') || ''
      if (this.sessionId) {
        this.showSessionsTable = false

        const results = await this.getChartData(this.sessionId)
        this.chartData = this.chartService.transformifyData(results)

        console.log('chartData:', this.chartData)

        // init reaction time chart
        // this.initReactionChart(this.chartData)

        // init achievement chart
        // this.initAchievementChart(this.chartData)

      } else {
        this.showSessionsTable = true
        // this.fetchSessions()
      }
    })
  }

  async getChartData(sessionId: string): Promise<any> {
    return new Promise((resolve, _) => {
      this.chartService.getChartData(sessionId).subscribe(data => resolve(data))
    })
  }

  // async fetchSessions() {
  //   const response = await GraphqlService.client.request(GqlConstants.GET_SESSIONS)
  //   console.log('fetchSessions:response:', response)
  //   this.sessions = response.session
  // }

  initReactionChart(chartData: ChartSessionData) {
    // pick the first session
    const sessionIds = Object.keys(chartData)
    const firstSessionId = sessionIds[0]

    // building chartjs DS
    const labels = new Set()
    const reactionData = []
    const backgroundColor = []

    for (const activity in chartData[firstSessionId]) {
      const activityDetails = chartData[firstSessionId][activity].events

      if (!activityDetails) continue

      let totalReactionTime = 0

      for (const eventDetail of activityDetails) {
        labels.add(eventDetail.activityName)

        if (eventDetail.reactionTime) {
          totalReactionTime += parseFloat(eventDetail.reactionTime)
        }
      }

      // building average reaction time for each activity
      let avgReactionTime = totalReactionTime / activityDetails.length
      avgReactionTime = parseFloat(avgReactionTime.toFixed(2))
      reactionData.push(avgReactionTime)

      // building background color
      backgroundColor.push('#000066')
    }

    const data = {
      labels: [...labels],
      datasets: [{
        data: [...reactionData],
        backgroundColor,
        fill: true,
        label: 'activities'
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
              text: 'Avg Reaction Time (Milliseconds)',
              font: {
                size: 18
              },
              padding: 12
            },
            ticks: {
              callback: (value: number) => `${value}ms`,
              font: {
                size: 14
              },
              color: '#000066'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Activities',
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
            display: true,
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
    const ctx = document.getElementById('reactionTimeChart').getContext('2d')
    if (ctx) {
      // @ts-ignore: TypeScript headache - fix later
      new Chart(ctx, config)
    }
  }

  initAchievementChart(chartData: ChartSessionData) {
    // pick the first session
    const sessionIds = Object.keys(chartData)
    const firstSessionId = sessionIds[0]
    // building chartjs DS
    const labels = new Set()
    const achievementData = []

    for (const activity in chartData[firstSessionId]) {
      const activityDetails = chartData[firstSessionId][activity].events

      if (!activityDetails) continue

      let success = 0;
      for (const eventDetail of activityDetails) {
        if (eventDetail.activityName && eventDetail.score) {
          labels.add(eventDetail.activityName)
          success += eventDetail.score * 100
        }
      }

      success = success / (activityDetails.length)

      // work-around for calibration
      if (activityDetails[0].activityName === 'Calibration') {
        success = success * 2
      }

      achievementData.push(success)

    }

    const data = {
      labels: [...labels],
      datasets: [{
        data: [...achievementData],
        backgroundColor: '#000066',
        borderColor: '#000066',
        pointBackgroundColor: '#000066',
        radius: 6,
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
        scales: {
          y: {
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
          title: {
            display: true,
            align: 'center',
            text: 'Achievement Ratio',
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
      new Chart(ctx, config)
    }
  }
}
