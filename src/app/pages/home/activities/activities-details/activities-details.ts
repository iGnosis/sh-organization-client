import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Activity, ActivityEvent } from 'src/app/types/activity';

@Component({
  selector: 'app-activities-details',
  templateUrl: './activities-details.component.html',
  styleUrls: ['./activities-details.component.scss']
})
export class ActivitiesDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  patientIdentifier?: string
  activityId?: string
  activityDetails?: Activity

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.route.queryParamMap.subscribe((params: ParamMap) => {
        this.activityDetails = JSON.parse(params.get('activityDetails')!)
        this.patientIdentifier = params.get('patientIdentifier')!
      })

      this.activityId = params.get('id') || ''
      console.log('activityId:', this.activityId)
      console.log('activityDetails:', this.activityDetails)

      // init charts here
      this.initReactionTimeChart()
      this.initAchievementChart()
    })
  }

  initAchievementChart() {
    let labels: any = []
    const numTasks = this.activityDetails?.events?.length
    if (numTasks) {
      labels = [...Array(numTasks + 1).keys()]
      // get rid of the first '0'
      labels = labels.splice(1)
    }

    const achievementData = this.activityDetails?.events?.map((event: ActivityEvent) => event.score! * 100)
    const taskName = this.activityDetails?.events?.map((event: ActivityEvent) => event.taskName)

    console.log('initAchievementChart:labels', labels)
    console.log('initAchievementChart:achievementData', achievementData)

    const data = {
      labels,
      datasets: [{
        data: achievementData,
        taskName, // need this for tooltips
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
              text: 'Total Attempts',
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
          },
          tooltip: {
            titleFont: {
              size: 16
            },
            bodyFont: {
              size: 16
            },
            caretSize: 15,
            callbacks: {
              label: function (tooltipItem: any) {
                // console.log('tooltipItem:', tooltipItem)
                const taskName = tooltipItem.dataset.taskName[tooltipItem.dataIndex]
                const successRatio = tooltipItem.dataset.data[tooltipItem.dataIndex]
                return `${taskName} - ${successRatio.toFixed(2)}%`
              }
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

  initReactionTimeChart() {
    const labels = this.activityDetails?.events?.map((event: ActivityEvent) => event.taskName)
    const reactionData = this.activityDetails?.events?.map((event: ActivityEvent) => event.reactionTime)
    const backgroundColor = this.activityDetails?.events?.map((event: ActivityEvent) => {
      if (event.score === 0) {
        return '#808da1' // success color
      }
      return '#1ac452' // danger color
    })

    console.log('initReactionChart:labels:', labels)
    console.log('initReactionChart:reactionData:', reactionData)

    const data = {
      labels,
      datasets: [{
        data: reactionData,
        backgroundColor,
        label: 'reps'
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
              text: 'Reaction Time (Milliseconds)',
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
              text: 'Total Attempts',
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

    // @ts-ignore: TypeScript headache - fix later
    const ctx = document.getElementById('reactionTimeChart').getContext('2d')
    if (ctx) {
      // @ts-ignore: TypeScript headache - fix later
      new Chart(ctx, config)
    }
  }
}
