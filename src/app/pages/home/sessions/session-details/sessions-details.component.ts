import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SessionData } from 'src/app/types/chart';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Activity, ActivityEvent } from 'src/app/types/activity';
import { Session } from 'src/app/types/session';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-sessions-details',
  templateUrl: './sessions-details.component.html',
  styleUrls: ['./sessions-details.component.scss']
})
export class SessionsDetailsComponent implements OnInit {
  sessionId?: string
  sessionCompletionRatio?: number
  patientConditions = ''
  sessionDetails?: any
  activityDetails: Array<Activity> = []

  constructor(private router: Router, private route: ActivatedRoute, private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {

      this.route.queryParamMap.subscribe((params: ParamMap) => {
        this.sessionDetails = JSON.parse(params.get('sessionDetails')!)
      })

      this.sessionId = params.get('id') || ''

      if (this.sessionId && this.sessionDetails) {
        console.log(this.sessionId, this.sessionDetails)
        this.initPatientConditions()

        this.initReactionChart(this.sessionDetails)
        this.initAchievementChart(this.sessionDetails)

        // prepare activity level-analytics
        for (const activityId in this.sessionDetails.sessionAnalytics) {

          const activity = {
            id: activityId,
            createdAt: 1,
            name: '',
            prompt: 'Visual, Auditory',
            duration: 0,
            durationInStr: '',
            reps: 10,
            correctMotions: 8,
            achievementRatio: 80,
            reactionTime: 4000,
            events: []
          }

          const activityEvents: Array<ActivityEvent> = this.sessionDetails.sessionAnalytics[activityId].events
          activity.events = this.sessionDetails.sessionAnalytics[activityId].events

          if (!activityEvents || !Array.isArray(activityEvents) || !activityEvents.length) {
            return
          }

          if (activityEvents[0].activityName && activityEvents[0].createdAt) {
            activity.name = activityEvents[0].activityName
            activity.createdAt = activityEvents[0].createdAt
          }

          // edge case -- handle later
          if (activityEvents.length === 1) {
            activity.duration = 60000 / 1000
          } else {
            const minTime = activityEvents[0].createdAt
            const maxTime = activityEvents[activityEvents.length - 1].createdAt
            if (minTime && maxTime) {
              activity.duration = (maxTime - minTime) / 1000 // duration in seconds
              activity.durationInStr = this.secondsToTime(activity.duration)
            }
          }

          let totalNumEvents = 0
          let incorrectMotions = 0
          let totalReactionTime = 0
          for (const event of activityEvents) {
            // build this below JSON struct and append it to the array
            if (event.reactionTime) {
              totalReactionTime += event.reactionTime
            }
            if (event.score === 0) {
              incorrectMotions++
            }
            totalNumEvents++
          }

          activity.reps = totalNumEvents
          activity.correctMotions = totalNumEvents - incorrectMotions
          activity.achievementRatio = parseFloat(((activity.correctMotions / totalNumEvents) * 100).toFixed(2))
          activity.reactionTime = parseFloat((totalReactionTime / totalNumEvents).toFixed(2))

          this.activityDetails.push(activity)
        }

        this.fetchSessionCompletionRatio(this.sessionId)
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

  initReactionChart(chartData: Session) {
    // pick the first session
    const sessionId = chartData.id

    if (!sessionId) return

    // building chartjs DS
    const labels = new Set()
    const reactionData = []

    console.log('initReactionChart:chartData:sessionAnalytics', chartData.sessionAnalytics)

    // for (const activity in chartData.sessionAnalytics) {
    //   console.log('activity:', activity)
    // }

    for (const activity in chartData.sessionAnalytics) {
      const activityDetails = chartData.sessionAnalytics[activity].events
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
    }

    console.log('initReactionChart:labels:', labels)
    console.log('initReactionChart:reactionData:', reactionData)

    const data = {
      labels: [...labels],
      datasets: [{
        data: [...reactionData],
        backgroundColor: '#000066',
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
            display: false,
            align: 'center',
            text: 'Reaction Time',
            fullSize: true,
            font: {
              size: 28
            }
          },
          legend: {
            // don't show label
            display: false
          }
        },
      }
    }

    let myChart = null
    // @ts-ignore: TypeScript headache - fix later
    const ctx = document.getElementById('sessionReactionTimeChart').getContext('2d')
    if (ctx) {
      if (myChart != null) {
        // @ts-ignore: TypeScript headache - fix later
        myChart.destroy()
      }
      // @ts-ignore: TypeScript headache - fix later
      myChart = new Chart(ctx, config)
    }
  }

  initAchievementChart(chartData: Session) {
    // pick the first session
    const sessionId = chartData.id
    if (!sessionId) return

    // building chartjs DS
    const labels = new Set()
    const achievementData = []

    for (const activity in chartData.sessionAnalytics) {
      console.log('initAchievementChart:activity:', activity)

      const activityDetails = chartData.sessionAnalytics[activity].events

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

    console.log('initAchievementChart:labels', labels)
    console.log('initAchievementChart:achievementData', achievementData)

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
        label: 'Success Ratio',
        clip: false
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
            max: 100,
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
              stepSize: 20,
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
          legend: {
            // don't show label
            display: false
          }
        }
      }
    }

    let myChart = null
    // @ts-ignore: TypeScript headache - fix later
    const ctx = <HTMLCanvasElement>document.getElementById('sessionAchievementChart').getContext('2d')!
    if (ctx) {
      if (myChart != null) {
        // @ts-ignore: TypeScript headache - fix later
        myChart.destroy()
      }
      // @ts-ignore: TypeScript headache - fix later
      myChart = new Chart(ctx, config)
    }
  }

  secondsToTime(seconds: number) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const m = Math.floor(seconds % 3600 / 60).toString().padStart(2, '0')
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`;
  }

  fetchSessionCompletionRatio(sessionId: string) {
    this.analyticsService.getSessionCompletionRatio(sessionId).subscribe((result: any) => {
      result = result.toFixed(2)
      this.sessionCompletionRatio = result
    })
  }

  openActivityDetailsPage(activityId: string, activityDetails: ActivityEvent) {
    this.router.navigate(
      ['/app/activities/', activityId],
      {
        queryParams: {
          activityDetails: JSON.stringify(activityDetails),
          patientIdentifier: this.sessionDetails.patientByPatient.identifier
        }
      }
    )
  }
}
