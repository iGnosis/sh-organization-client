import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SessionData } from 'src/app/types/chart';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Activity, ActivityEvent } from 'src/app/types/activity';

@Component({
  selector: 'app-sessions-details',
  templateUrl: './sessions-details.component.html',
  styleUrls: ['./sessions-details.component.scss']
})
export class SessionsDetailsComponent implements OnInit {
  sessionId?: string
  patientConditions: String = ''
  sessionDetails?: any
  activityDetails?: Array<Activity>

  // data that is passed into Chart init functions
  // so we can render the charts
  // chartData?: ChartSessionData

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {

      this.route.queryParamMap.subscribe((params: ParamMap) => {
        this.sessionDetails = JSON.parse(params.get('sessionDetails')!)
      })

      this.sessionId = params.get('id') || ''

      if (this.sessionId && this.sessionDetails) {
        console.log(this.sessionId, this.sessionDetails)
        this.initPatientConditions()

        // const results = await this.getChartData(this.sessionId)
        // this.chartData = this.chartService.transformifyData(results)
        // console.log('chartData:', this.chartData)
        // init reaction time chart
        // this.initReactionChart(this.chartData)
        // init achievement chart
        // this.initAchievementChart(this.chartData)

        for (const activityId in this.sessionDetails.sessionAnalytics) {

          const activity = {
            id: activityId,
            createdAt: 1,
            name: '',
            prompt: 'Visual, Auditory',
            duration: 0,
            reps: 10,
            correctMotions: 8,
            achievementRatio: 80,
            reactionTime: 4000,
          }

          const activityEvents: Array<ActivityEvent> = this.sessionDetails.sessionAnalytics[activityId].events
          console.log(activityId, activityEvents)

          if (!activityEvents || !Array.isArray(activityEvents) || !activityEvents.length) {
            return
          }

          if (activityEvents[0].activityName && activityEvents[0].createdAt) {
            activity.name = activityEvents[0].activityName
            activity.createdAt = activityEvents[0].createdAt
          }

          // work out event duration

          // edge case -- handle later
          if (activityEvents.length === 1) {
            activity.duration = 60000 / 1000
          } else {
            const minTime = activityEvents[0].createdAt
            const maxTime = activityEvents[activityEvents.length - 1].createdAt
            if (minTime && maxTime) {
              activity.duration = (maxTime - minTime) / 1000 // duration in seconds
            }
          }

          let totalNumEvents = 0
          for (const event of activityEvents) {
            // build this below JSON struct and append it to the array
            totalNumEvents++
          }
        }

        this.activityDetails = [
          {
            id: '1234',
            createdAt: 1,
            name: 'Sit To Stand',
            prompt: 'Visual, Auditory',
            duration: 100,
            reps: 10,
            correctMotions: 8,
            achievementRatio: 80,
            reactionTime: 4000,
          },
          {
            id: '8901',
            createdAt: 1,
            name: 'Hallel.',
            prompt: 'Visual, Auditory',
            duration: 200,
            reps: 8,
            correctMotions: 7,
            achievementRatio: 90,
            reactionTime: 3600,
          }
        ]
      }
    })
  }

  initPatientConditions() {
    const conditions = this.sessionDetails.patientByPatient.medicalConditions
    for (const condition in conditions) {
      if (conditions[condition] === true) {
        this.patientConditions += `${condition}, `
      }
    }

    if (this.patientConditions) {
      this.patientConditions = this.patientConditions.slice(0, this.patientConditions.length - 2)
    }
  }

  initReactionChart(chartData: SessionData) {
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

  initAchievementChart(chartData: SessionData) {
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

  secondsToString(seconds: number): string {
    const numMinutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60)
    return `${numMinutes} minutes`
  }

}