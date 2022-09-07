import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Chart, ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Activity, ActivityEvent, Session } from 'src/app/pointmotion';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { environment } from 'src/environments/environment';
import { capitalize } from 'lodash';

type GameObj = {
  calibrationDuration: number;
  createdAt: string;
  endedAt: string;
  game: string;
  id: string;
  patient: string;
  repsCompleted: number;

  totalDuration: string;
};
@Component({
  selector: 'app-sessions-details',
  templateUrl: './sessions-details.component.html',
  styleUrls: ['./sessions-details.component.scss'],
})
export class SessionsDetailsComponent implements OnInit {
  gameId: string;
  sessionCompletionRatio?: number;
  patientConditions = '';
  gameDetails: any;
  activityDetails: Array<Activity> = [];
  sessionReactionTimeChart: Chart;
  sessionAchievementChart: Chart;
  showDownloadSession = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService,
    private graphqlService: GraphqlService
  ) {}

  ngOnInit() {
    if (environment.name === 'local' || environment.name === 'dev') {
      this.showDownloadSession = true;
    }

    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.gameId = params.get('id') || '';

      const game = await this.graphqlService.client.request(
        GqlConstants.GET_GAME_BY_PK,
        {
          gameId: this.gameId,
        }
      );

      this.gameDetails = game.game_by_pk;
      console.log('gameDetails:', this.gameDetails);

      this.initAchievementChart(this.gameDetails.id);

      // // work out time duration
      // if (this.gameDetails.createdAt && this.gameDetails.endedAt) {
      //   this.gameDetails.timeDuration =
      //     this.analyticsService.calculateTimeDuration(
      //       this.gameDetails.createdAt,
      //       this.gameDetails.endedAt
      //     );
      // }

      // this.analyticsService
      //   .getAnalytics([this.gameId])
      //   .subscribe((sessionAnalytics: any) => {
      //     let performanceRatio = 0;
      //     let totalEventsPerSession = 0;
      //     let avgReactionTime = 0;
      //     const session = sessionAnalytics[this.gameId!];
      //     this.gameDetails.sessionAnalytics = session;
      //     for (const activity in session) {
      //       for (const event of session[activity].events) {
      //         // console.log('event:', event)
      //         performanceRatio += event.score * 100;
      //         avgReactionTime += event.reactionTime;
      //         totalEventsPerSession++;
      //       }
      //     }
      //     performanceRatio = performanceRatio / totalEventsPerSession;
      //     performanceRatio = Math.round(performanceRatio * 100) / 100;
      //     this.gameDetails.totalPerformanceRatio = performanceRatio;
      //     this.gameDetails.avgReactionTime = parseFloat(
      //       (avgReactionTime / totalEventsPerSession).toFixed(2)
      //     );

      //     console.log(this.gameId, this.gameDetails);
      //     this.initPatientConditions();

      //     this.initReactionChart(this.gameDetails);
      //     this.initAchievementChart(this.gameDetails);

      //     // prepare activity level-analytics
      //     for (const activityId in this.gameDetails.sessionAnalytics) {
      //       const activity = {
      //         id: activityId,
      //         createdAt: 1,
      //         name: '',
      //         prompt: 'Visual, Auditory',
      //         duration: 0,
      //         durationInStr: '',
      //         reps: 10,
      //         correctMotions: 8,
      //         achievementRatio: 80,
      //         reactionTime: 4000,
      //         events: [],
      //       };

      //       const activityEvents: Array<ActivityEvent> =
      //         this.gameDetails.sessionAnalytics[activityId].events;
      //       activity.events =
      //         this.gameDetails.sessionAnalytics[activityId].events;

      //       if (
      //         !activityEvents ||
      //         !Array.isArray(activityEvents) ||
      //         !activityEvents.length
      //       ) {
      //         return;
      //       }

      //       if (activityEvents[0].activityName && activityEvents[0].createdAt) {
      //         activity.name = activityEvents[0].activityName;
      //         activity.createdAt = activityEvents[0].createdAt;
      //       }

      //       // edge case -- handle later
      //       if (activityEvents.length === 1) {
      //         activity.duration = 60000 / 1000;
      //       } else {
      //         const minTime = activityEvents[0].createdAt;
      //         const maxTime =
      //           activityEvents[activityEvents.length - 1].createdAt;
      //         if (minTime && maxTime) {
      //           activity.duration = (maxTime - minTime) / 1000; // duration in seconds
      //           activity.durationInStr = this.secondsToTime(activity.duration);
      //         }
      //       }

      //       let totalNumEvents = 0;
      //       let incorrectMotions = 0;
      //       let totalReactionTime = 0;
      //       for (const event of activityEvents) {
      //         // build this below JSON struct and append it to the array
      //         if (event.reactionTime) {
      //           totalReactionTime += event.reactionTime;
      //         }
      //         if (event.score === 0) {
      //           incorrectMotions++;
      //         }
      //         totalNumEvents++;
      //       }

      //       activity.reps = totalNumEvents;
      //       activity.correctMotions = totalNumEvents - incorrectMotions;
      //       activity.achievementRatio = parseFloat(
      //         ((activity.correctMotions / totalNumEvents) * 100).toFixed(2)
      //       );
      //       activity.reactionTime = parseFloat(
      //         (totalReactionTime / totalNumEvents).toFixed(2)
      //       );

      //       this.activityDetails.push(activity);
      //     }
      //     this.fetchSessionCompletionRatio(this.gameId);
      //   });
    });
  }

  // initPatientConditions() {
  //   const conditions = this.gameDetails.patientByPatient.medicalConditions;
  //   for (const condition in conditions) {
  //     if (conditions[condition] === true) {
  //       this.patientConditions += `${condition}, `;
  //     }
  //   }

  //   if (this.patientConditions) {
  //     this.patientConditions = this.patientConditions.slice(
  //       0,
  //       this.patientConditions.length - 2
  //     );
  //   }
  // }

  initReactionChart(chartData: Session) {
    // pick the first session
    const sessionId = chartData.id;

    if (!sessionId) return;

    // building chartjs DS
    const labels = new Set();
    const reactionData = [];

    console.log(
      'initReactionChart:chartData:sessionAnalytics',
      chartData.sessionAnalytics
    );

    // for (const activity in chartData.sessionAnalytics) {
    //   console.log('activity:', activity)
    // }

    for (const activity in chartData.sessionAnalytics) {
      const activityDetails = chartData.sessionAnalytics[activity].events;
      if (!activityDetails) continue;

      let totalReactionTime = 0;
      for (const eventDetail of activityDetails) {
        labels.add(eventDetail.activityName);

        if (eventDetail.reactionTime) {
          totalReactionTime += parseFloat(eventDetail.reactionTime);
        }
      }

      // building average reaction time for each activity
      let avgReactionTime = totalReactionTime / activityDetails.length;
      avgReactionTime = parseFloat(avgReactionTime.toFixed(2));
      reactionData.push(avgReactionTime);
    }

    console.log('initReactionChart:labels:', labels);
    console.log('initReactionChart:reactionData:', reactionData);

    const data = {
      labels: [...labels],
      datasets: [
        {
          data: [...reactionData],
          backgroundColor: '#000066',
          fill: true,
          label: 'activities',
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      plugins: [ChartDataLabels],
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Avg Reaction Time (Milliseconds)',
              font: {
                size: 18,
              },
              padding: 12,
            },
            ticks: {
              callback: (value: any) => `${value}ms`,
              font: {
                size: 14,
              },
              color: '#000066',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Activities',
              font: {
                size: 18,
              },
              padding: 12,
            },
            ticks: {
              font: {
                size: 14,
              },
              color: '#000066',
            },
          },
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'start',
            offset: 10,
            color: 'white',
            font: {
              size: 14,
            },
          },
          title: {
            display: false,
            align: 'center',
            text: 'Reaction Time',
            fullSize: true,
            font: {
              size: 28,
            },
          },
          legend: {
            // don't show label
            display: false,
          },
        },
      },
    };

    const canvas = <HTMLCanvasElement>(
      document.getElementById('sessionReactionTimeChart')
    );
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.sessionReactionTimeChart != null) {
        this.sessionReactionTimeChart.destroy();
      }
      this.sessionReactionTimeChart = new Chart(ctx, config);
    }
  }

  async initAchievementChart(gameId: string) {
    const response = await this.graphqlService.gqlRequest(
      GqlConstants.GAME_ACHIEVEMENT_CHART,
      { gameId },
      true
    );

    const gameAchievementRatioData: { data: number[]; labels: string[] } =
      response.gameAchievementRatio.data;

    const backgroundColor = ['#00BD3E', '#718096'];

    console.log('gameAchievementRatio', response);

    const data = {
      labels: gameAchievementRatioData.labels,
      datasets: [
        {
          data: gameAchievementRatioData.data,
          backgroundColor,
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };
    const config: ChartConfiguration = {
      type: 'pie',
      data: data,
      options: {
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 16,
              },
            },
          },
          datalabels: {
            font: {
              size: 26,
              weight: 'bold',
            },
            color: ['#000000', '#ffffff'],
          },
        },
      },
      plugins: [ChartDataLabels],
    };

    const canvas = <HTMLCanvasElement>(
      document.getElementById('sessionAchievementChart')
    );
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.sessionAchievementChart != null) {
        this.sessionAchievementChart.destroy();
      }
      this.sessionAchievementChart = new Chart(ctx, config);
    }
  }

  secondsToTime(seconds: number) {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  fetchSessionCompletionRatio(sessionId: string) {
    this.analyticsService
      .getSessionCompletionRatio(sessionId)
      .subscribe((result: any) => {
        result = result.toFixed(2);
        this.sessionCompletionRatio = result;
      });
  }

  openActivityDetailsPage(activityId: string, activityDetails: ActivityEvent) {
    this.router.navigate(['/app/activities/', activityId], {
      queryParams: {
        activityDetails: JSON.stringify(activityDetails),
        patientIdentifier: this.gameDetails.patientByPatient.identifier,
      },
    });
  }

  downloadSession() {
    const data = JSON.stringify(this.gameDetails);
    const a = document.createElement('a');
    const file = new Blob([data], { type: 'application/json' });
    a.href = URL.createObjectURL(file);
    a.download = `${this.gameId}_analytics.json`;
    a.click();
  }

  getName(game: string): string {
    return game
      .split('_')
      .map((str) => capitalize(str))
      .join(' ');
  }
}
