import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartService } from 'src/app/services/chart/chart.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableFilter } from 'mat-table-filter';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitterService } from 'src/app/services/eventemitter/event-emitter.service';
import { CarePlanService } from 'src/app/services/care-plan/care-plan.service';
import { SessionService } from 'src/app/services/session/session.service';
import { DashboardState, Game, Patient } from 'src/app/pointmotion';
import { AddCareplan } from '../add-careplan/add-careplan-popup.component';
import { groupBy as lodashGroupBy, capitalize } from 'lodash';
import * as moment from 'moment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Store } from '@ngrx/store';
import { dashboard } from 'src/app/store/actions/dashboard.actions';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { TesterVideoModalComponent } from 'src/app/components/tester-video-modal/tester-video-modal.component';

export class Captain {
  careplanByCareplan: string;
  surname: string;
  medicalConditions: any;
  therapist: string;
}

export class SpaceCraft {
  careplanByCareplan: string;
  medicalConditions: any;
  isConstitutionClass: boolean;
  captain: Captain;
  therapist: string;
  identifier: string;
}
@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit, OnDestroy {
  isShowDiv = true;
  selected: any;
  isShowFilter = true;
  allowMultiSelect: boolean | undefined;
  initialSelection: unknown[] | undefined;
  activeCarePlans: any | undefined;
  patientIdentifier: string;
  getActivityCount: number;
  getEstimatedActivityDuration: number;
  engagementChartFilter?: string = undefined;

  showEmptyState = false;

  availableGames = [
    'all_activities',
    'sit_stand_achieve',
    'beat_boxer',
    'sound_explorer',
    'moving_tones',
  ];
  activityFilterOptions = this.availableGames;
  subscriptionStatus!: string;

  toggleFilterDiv() {
    this.isShowFilter = !this.isShowFilter;
  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  @ViewChild('dataSourceSort') dataSourceSort: MatSort = new MatSort();
  @ViewChild('dataSourcePaginator') dataSourcePaginator: MatPaginator;
  @ViewChild('videoDataSourceSort') videoDataSourceSort: MatSort =
    new MatSort();
  @ViewChild('videoDataSourcePaginator') videoDataSourcePaginator: MatPaginator;
  dataSource: MatTableDataSource<Game>;
  videoDataSource: MatTableDataSource<{
    id: string;
    startedAt: string;
    endedAt: string;
    duration: number;
  }>;
  videoTableDisplayColumns: string[] = [
    // 'total_count',
    'startedAt',
    'endedAt',
    'duration',
    'view_recording',
  ];

  searchValue: any;
  isRowsChecked = false;
  achievementChart: Chart;
  engagementChart: Chart;
  moodVariationChart: Chart;

  startDate: Date;
  endDate: Date;

  dateSubscription: Subscription;
  noSessionAssignedPlan: number;
  selection: any;
  row: any;
  filterEntity: SpaceCraft;
  filterType: MatTableFilter;
  displayedColumns: string[] = [
    'total_count',
    'activity_type',
    'timeDuration',
    'createdAt',
    'game',
    'avgAchievementRatio',
    'activity_action',
  ];
  patientId?: string;
  details?: Patient;
  totalGamesCount?: number;
  gameDetails: Array<Game>;
  selectedCarePlanId: string;

  dateFilter: { label: string; range: number }[] = [
    { label: 'Today', range: 0 },
    { label: 'Past 7 days', range: 7 },
    { label: 'Past 14 days', range: 14 },
    { label: 'Past 30 days', range: 30 },
    { label: 'Past 90 days', range: 90 },
    { label: 'Past 180 days', range: 180 },
  ];
  selectedDateRange = 0;

  customOptions: OwlOptions = {
    loop: false,
    dots: false,
    navSpeed: 700,
    responsive: {
      940: {
        items: 2,
      },
    },
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private analyticsService: AnalyticsService,
    private carePlanService: CarePlanService,
    private graphqlService: GraphqlService,
    private sessionService: SessionService,
    private chartService: ChartService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    public eventEmitterService: EventEmitterService,
    private store: Store<{ dashboard: DashboardState }>,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.set('@patientName', '...');
    this.endDate = new Date();
    this.startDate = this.endDate;

    this.dateSubscription = this.store
      .select('dashboard')
      .subscribe(async (state) => {
        this.selectedDateRange = this.dateFilter.findIndex(
          (item) => item.range === state.dateRange
        );
        await this.updateChartTimeline(state.dateRange);
      });
  }

  ngOnDestroy(): void {
    this.dateSubscription.unsubscribe();
  }

  async ngOnInit() {
    this.selection = new SelectionModel(
      this.allowMultiSelect,
      this.initialSelection
    );
    this.filterEntity = new SpaceCraft();
    this.filterEntity.captain = new Captain();
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.patientId = params.get('id') || '';

      if (this.patientId) {
        try {
          await this.fetchSessions();
          await this.fetchTestingVideos(this.patientId);

          const subscriptionIdResp = await this.graphqlService.gqlRequest(
            GqlConstants.GET_SUBSCRIPTION_ID,
            {
              patientId: this.patientId,
            },
            true
          );

          if (subscriptionIdResp.patient_by_pk.subscription) {
            const resp = await this.graphqlService.gqlRequest(
              GqlConstants.SUBSCRIPTION_STATUS,
              {
                subscriptionId: subscriptionIdResp.patient_by_pk.subscription,
              },
              true
            );

            this.subscriptionStatus = resp.subscriptions[0].status;
            console.log('resp', resp.subscriptions[0].status);
          } else {
            // TODO: handle this case in the UI.
            this.subscriptionStatus = 'not_subscribed';
          }
        } catch (err) {
          console.log('Err::', err);
        }

        this.updateCharts('start', this.startDate!, 'achievement');
        this.updateCharts('end', this.endDate!, 'achievement');

        this.updateCharts('start', this.startDate!, 'engagement');
        this.updateCharts('end', this.endDate!, 'engagement');

        this.updateCharts('start', this.startDate!, 'mood');
        this.updateCharts('end', this.endDate!, 'mood');
      }
    });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.dataSourcePaginator;
      this.dataSource.sort = this.dataSourceSort;
    }

    if (this.videoDataSource) {
      this.videoDataSource.paginator = this.videoDataSourcePaginator;
      this.videoDataSource.sort = this.videoDataSourceSort;
    }
  }

  async updateChartTimeline(range: number) {
    this.startDate = new Date(this.endDate);
    this.startDate.setDate(this.startDate.getDate() - range);

    if (range == 0) this.startDate = this.endDate;

    if (this.patientId) {
      this.updateCharts('start', this.startDate!, 'achievement');
      this.updateCharts('end', this.endDate!, 'achievement');

      this.updateCharts('start', this.startDate!, 'engagement');
      this.updateCharts('end', this.endDate!, 'engagement');

      this.updateCharts('start', this.startDate!, 'mood');
      this.updateCharts('end', this.endDate!, 'mood');
    }
  }

  async setDateFilter(idx: number) {
    this.selectedDateRange = idx;
    const range = this.dateFilter[this.selectedDateRange].range;

    this.store.dispatch(dashboard.setDateRange({ dateRange: range }));
    await this.updateChartTimeline(range);
  }

  openCarePlanDialog() {
    const dialogRef = this.dialog.open(AddCareplan);
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
    this.eventEmitterService.SentPatientID(this.patientId);
  }

  openCarePlanDetails(id: string) {
    this.router.navigate(['/app/care-plans/', id]);
  }

  async fetchSessions() {
    const resp = await this.graphqlService.client.request(
      GqlConstants.GET_GAMES,
      {
        patientId: this.patientId,
      }
    );

    const games = resp.game;
    if (games && games.length === 0) {
      this.showEmptyState = true;
    }
    const aggregatedAnalytics = resp.aggregate_analytics;

    const mergedArr = games.map((game: any) => ({
      ...aggregatedAnalytics.find(
        (analytics: any) => analytics.game === game.id && analytics
      ),
      ...game,
    }));

    mergedArr.forEach((val: any) => {
      val.avgAchievementRatio = parseFloat((val.value * 100).toFixed(2));
      if (val.createdAt && val.endedAt) {
        val.timeDuration = this.analyticsService.calculateTimeDuration(
          val.createdAt,
          val.endedAt
        );
      }
    });

    this.gameDetails = mergedArr;
    this.dataSource = new MatTableDataSource(mergedArr);
    setTimeout(() => {
      this.dataSource.paginator = this.dataSourcePaginator;
      this.dataSource.sort = this.dataSourceSort;
    }, 100);

    const patient = await this.graphqlService.client.request(
      GqlConstants.GET_PATIENT_IDENTIFIER,
      { patientId: this.patientId }
    );
    this.patientIdentifier = patient.patient[0].nickname;
    this.breadcrumbService.set('@patientName', this.patientIdentifier);
  }

  async GetAssignedCarePlan() {
    const response = await this.graphqlService.client.request(
      GqlConstants.GET_ACTIVE_PLANS,
      { patient: this.patientId }
    );
    this.activeCarePlans = response.patient[0].patient_careplans;
    //console.log(this.active_careplans.length,"length");
    // this.getCarePlanCount = this.activeCarePlans.length;
    if (this.activeCarePlans.length > 0) {
      this.getActivityCount =
        this.activeCarePlans[0].careplanByCareplan?.careplan_activities_aggregate?.aggregate?.count;
      this.getEstimatedActivityDuration =
        this.activeCarePlans[0].careplanByCareplan.estimatedDuration;
    }

    if (this.getActivityCount == 0 && this.dataSource.data.length == 0) {
      this.noSessionAssignedPlan = 1;
    } else {
      this.noSessionAssignedPlan = 0;
    }
  }

  async openRemoveCareplanFromPatientModal(
    careplan: string,
    modalContent: any
  ) {
    this.modalService.open(modalContent);
    this.selectedCarePlanId = careplan;
  }

  async removeCarePlanFromPatient(modal: NgbModal) {
    if (this.patientId) {
      await this.carePlanService.detachCarePlan(this.patientId, [
        this.selectedCarePlanId,
      ]);
      this.modalService.dismissAll();
      window.location.reload();
    } else {
      throw new Error('patientId not initialized');
    }
  }

  async startSessionFromCareplan() {
    if (this.patientId) {
      const session = await this.sessionService.new(
        this.patientId,
        this.selectedCarePlanId
      );
      if (session.insert_session_one && session.insert_session_one.id) {
        this.router.navigate(['/session/', session.insert_session_one.id]);
      }
    } else {
      throw new Error('patientId not initialized');
    }
    this.modalService.dismissAll();
  }

  async openStartSessionFromCareplanModal(
    careplan: string,
    modalContent?: any
  ) {
    this.modalService.open(modalContent);
    this.selectedCarePlanId = careplan;
  }

  async initEngagementChart(startDate: string, endDate: string) {
    const data: any = {
      labels: [],
      datasets: [
        {
          data: [],
          careplanNames: [], // need this for tooltips
          backgroundColor: '#2F51AE',
          fill: true,
          label: 'Completion Ratio',
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
            max: 100,
            title: {
              display: true,
              text: 'Session Completion',
              color: '#000000',
              font: {
                size: 18,
              },
              padding: 12,
            },
            ticks: {
              callback: (value: any) => `${value}%`,
              font: {
                size: 14,
              },
              stepSize: 20,
              color: '#000066',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Day',
              font: {
                size: 18,
              },
              color: '#000000',
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
          // hide Label 'success ratio'
          legend: {
            display: false,
          },
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
          tooltip: {
            titleFont: {
              size: 16,
            },
            bodyFont: {
              size: 16,
            },
            caretSize: 15,
            callbacks: {
              label: function (tooltipItem: any) {
                // console.log('tooltipItem:', tooltipItem)
                const careplanName =
                  tooltipItem.dataset.careplanNames[tooltipItem.dataIndex];
                const successRatio =
                  tooltipItem.dataset.data[tooltipItem.dataIndex];
                return `${successRatio.toFixed(2)}%`;
              },
            },
          },
        },
      },
    };

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const engagementRatioData =
      await this.chartService.fetchPatientChartableData(
        startDate,
        endDate,
        userTimezone,
        this.patientId!,
        'avgEngagementRatio',
        'day',
        false
      );

    const chartResults: { [dateWithTimeZone: string]: number } =
      engagementRatioData.patientChart.data.results;

    for (const key in chartResults) {
      data.labels.push(key.split('T')[0].split('-')[2]);
      data.datasets[0].data.push(chartResults[key]);
    }

    // data.datasets[0].careplanNames = engagementRatioData.map(
    //   (result: EngagementRatio) => result.careplanName
    // );

    const canvas = <HTMLCanvasElement>(
      document.getElementById('engagementChart')
    );
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.engagementChart != null) {
        this.engagementChart.destroy();
      }
      this.engagementChart = new Chart(ctx, config);
    }
  }

  async initAchievementChart(
    startDate: Date,
    endDate: Date,
    filter?: string[]
  ) {
    const data: any = {
      labels: [],
      datasets: [
        {
          data: [],
          careplanNames: [], // need this for tooltips
          pointRadius: 5,
          backgroundColor: '#000066',
          borderColor: '#000066',
          pointBackgroundColor: '#000066',
          tension: 0.1,
          fill: false,
          label: 'Success Ratio',
          clip: false,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'line',
      data: data,
      options: {
        elements: {
          point: {
            hitRadius: 30,
            hoverRadius: 12,
          },
        },
        responsive: true,
        // making object array readable for ChartJS
        // parsing: {
        //   xAxisKey: 'id',
        //   yAxisKey: 'data.allSessions'
        // },
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
                size: 18,
              },
              color: '#000000',
              padding: 12,
            },
            ticks: {
              callback: (value: any) => `${value}%`,
              font: {
                size: 14,
              },
              stepSize: 20,
              color: '#000066',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Day',
              font: {
                size: 18,
              },
              padding: 12,
              color: '#000000',
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
          // hide Label 'success ratio'
          legend: {
            labels: {
              color: '#000000',
              padding: 12,
              font: {
                size: 14,
                weight: '500',
              },
            },
            display: true,
            position: 'bottom',
            align: 'center',
          },
          title: {
            display: false,
            align: 'center',
            text: 'Achievement Ratio:',
            fullSize: true,
            font: {
              size: 28,
            },
          },
          tooltip: {
            titleFont: {
              size: 16,
            },
            bodyFont: {
              size: 16,
            },
            caretSize: 15,
            callbacks: {
              label: function (tooltipItem: any) {
                // console.log('tooltipItem.dataset:', tooltipItem.dataset);
                const successRatio = tooltipItem.dataset.data[tooltipItem.dataIndex];
                return ` ${tooltipItem.dataset.label} - ${successRatio}%`;
              },
            },
          },
        },
      },
    };

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const achievementRatioData =
      await this.chartService.fetchPatientChartableData(
        startDate.toISOString(),
        endDate.toISOString(),
        userTimezone,
        this.patientId!,
        'avgAchievementRatio',
        'day',
        true
      );

    let games: string[];
    if (!filter) {
      games = this.availableGames;
    } else {
      games = filter;
    }

    const chartResults: {
      avgAchievementPercentage: number;
      game: string;
      createdAt: string;
    }[] = achievementRatioData.patientChart.data.results;

    const groupByGame = lodashGroupBy(chartResults, 'game');
    const generatedDates = this.generateDates(startDate, endDate);

    generatedDates.forEach((date) => {
      data.labels.push(date.split('T')[0].split('-')[2]);
    });

    const dataSet = [];
    const gameColor: { [key: string]: string } = {
      sit_stand_achieve: 'rgba(225, 162, 173, 0.1)',
      beat_boxer: 'rgba(1, 127, 110, 0.1)',
      sound_explorer: 'rgba(255, 176, 0, 0.1)',
      moving_tones: 'rgba(85, 204, 171, 0.1)',
    };
    const gameBorderColor: { [key: string]: string } = {
      sit_stand_achieve: 'rgb(225, 162, 173)',
      beat_boxer: 'rgb(1, 127, 110)',
      sound_explorer: 'rgb(255, 176, 0)',
      moving_tones: 'rgb(85, 204, 171)',
    };

    for (const game in groupByGame) {
      // filtering the games
      if (!games.includes(game)) {
        continue;
      }

      const data: (number | null)[] = [];

      const existingDates = groupByGame[game].map((val) =>
        new Date(val.createdAt).toISOString()
      );
      const stripDates = existingDates.map((val) => val.split('T')[0]);

      generatedDates.forEach((gDate) => {
        if (!stripDates.includes(gDate)) {
          data.push(0);
        } else {
          groupByGame[game].forEach((game) => {
            const strippedDate = new Date(game.createdAt)
              .toISOString()
              .split('T')[0];
            if (
              new Date(gDate).getTime() - new Date(strippedDate).getTime() ===
              0
            ) {
              data.push(game.avgAchievementPercentage);
            }
          });
        }
      });

      dataSet.push({
        label: game
          .split('_')
          .map((str) => capitalize(str))
          .join(' '),
        data,
        fill: true,
        tension: 0.1,
        borderColor: gameBorderColor[game],
        backgroundColor: gameColor[game],
        pointBackgroundColor: gameBorderColor[game],
      });
    }

    data.datasets = dataSet;

    // data.labels.push(result.createdAt.split('T')[0].split('-')[2]);

    // data.datasets[0].careplanNames = results.map(
    //   (result: AchievementRatio) => result.careplanName
    // );

    const canvas = <HTMLCanvasElement>(
      document.getElementById('achievementChart')
    );
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.achievementChart != null) {
        this.achievementChart.destroy();
      }
      this.achievementChart = new Chart(ctx, config);
    }
  }

  async initMoodVariationsChart(startDate: Date, endDate: Date) {
    const moodData = await this.chartService.patientMoodVariationChart(
      startDate,
      endDate,
      this.patientId!
    );

    const moodToNumber: {
      [key: string]: number;
    } = {
      irritated: 0,
      anxious: 1,
      okay: 2,
      happy: 3,
      daring: 4,
    };

    const moodToColor: {
      [key: string]: string;
    } = {
      irritated: '#CD001A',
      anxious: '#CD001A',
      okay: '#F6BE00',
      happy: '#00873E',
      daring: '#00873E',
    };

    const numberToMood: {
      [key: number]: string;
    } = {
      0: '😡 irritated',
      1: '😖 anxious',
      2: '😐 okay',
      3: '😀 happy',
      4: '😊 daring',
    };

    const data: ChartData = {
      labels: moodData.map(
        (mood) => mood.createdAt.split('T')[0].split('-')[2]
      ),
      datasets: [
        {
          label: 'Mood',
          data: moodData.map((mood) => moodToNumber[mood.mood]),
          pointBackgroundColor: moodData.map((mood) => moodToColor[mood.mood]),
          pointRadius: 6,
          pointHoverRadius: 10,
          fill: true,
          backgroundColor: 'rgba(173, 216, 230, 0.6)',
          borderColor: 'rgba(70, 130, 180, 0.5)',
        },
      ],
    };
    const options: ChartOptions = {
      elements: {
        line: {
          tension: 0.3,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          displayColors: false,
          bodyFont: {
            size: 22,
          },
          caretSize: 15,
          callbacks: {
            label: function (tooltipItem: any) {
              return numberToMood[tooltipItem.raw as number];
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Feelings',
            font: {
              size: 18,
            },
          },
          ticks: {
            callback: function (value) {
              return numberToMood[value as number];
            },
            font: {
              size: 16,
            },
          },
        },
        x: {
          title: {
            display: true,
            text: 'Day',
            font: {
              size: 18,
            },
            padding: 12,
            color: '#000000',
          },
          ticks: {
            font: {
              size: 14,
            },
            color: '#000066',
          },
        },
      },
    };

    const config: ChartConfiguration = {
      type: 'line',
      data: data,
      options: options,
    };
    const canvas = <HTMLCanvasElement>(
      document.getElementById('moodVariationsChart')
    );
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.moodVariationChart != null) {
        this.moodVariationChart.destroy();
      }
      this.moodVariationChart = new Chart(ctx, config);
    }
  }

  toogleRowsCheck() {
    const formCheckinputs = document.querySelectorAll('.row-check-input');
    if (this.isRowsChecked) {
      formCheckinputs.forEach((arr) => {
        arr.removeAttribute('checked');
      });
    } else {
      formCheckinputs.forEach((arr) => {
        arr.setAttribute('checked', '');
      });
    }
    this.isRowsChecked = !this.isRowsChecked;
  }

  openSessionDetailsPage(sessionId: string) {
    this.router.navigate(['/app/game/', sessionId]);
  }

  chartStartDate: Date;
  chartEndDate?: Date;
  updateCharts(
    type: 'start' | 'end',
    date: Date,
    chartType: 'achievement' | 'engagement' | 'mood'
  ) {
    date = new Date(date);
    if (!date) return;
    switch (type) {
      case 'start':
        if (date !== this.chartStartDate) {
          date.setHours(0, 0, 0, 0);
          this.chartStartDate = date;
          this.chartEndDate = undefined;
        }
        break;
      case 'end':
        if (date !== this.chartEndDate) {
          date.setHours(24, 0, 0, 0);
          this.chartEndDate = date;
        }
        break;
    }
    if (this.chartStartDate && this.chartEndDate) {
      if (chartType === 'engagement') {
        this.initEngagementChart(
          this.chartStartDate.toISOString(),
          this.chartEndDate.toISOString()
        );
      }
      if (chartType === 'achievement') {
        this.initAchievementChart(this.chartStartDate, this.chartEndDate);
      }
      if (chartType === 'mood') {
        this.initMoodVariationsChart(this.chartStartDate, this.chartEndDate);
      }
    }
  }

  generateDates(startDate: Date, endDate: Date) {
    const mStartDate = moment(startDate);
    const mEndDate = moment(endDate);
    const generateDates = [];

    while (mStartDate.isBefore(mEndDate)) {
      generateDates.push(mStartDate.format('YYYY-MM-DD'));
      mStartDate.add(1, 'day');
    }
    return generateDates;
  }

  filterAchievementRatioChart(event: SubmitEvent) {
    event.preventDefault();
    const filters: string[] = [];
    const form = document.querySelector('#filterAchievementRationForm')!;
    Array.from(form.querySelectorAll('input')).forEach(function (input) {
      if (input.checked) {
        filters.push(input.value);
      }
    });

    if (this.chartStartDate && this.chartEndDate) {
      if (
        filters.length === 0 ||
        (filters.length === 1 && filters.includes('all_activities'))
      ) {
        this.initAchievementChart(this.chartStartDate, this.chartEndDate);
      } else {
        this.initAchievementChart(
          this.chartStartDate,
          this.chartEndDate,
          filters
        );
      }
    }
  }

  async fetchTestingVideos(patientId: string) {
    const resp: {
      tester_videos: { id: string; startedAt: string; endedAt: string }[];
    } = await this.graphqlService.gqlRequest(
      GqlConstants.GET_TESTING_VIDEOS,
      {
        patientId,
      },
      true
    );
    console.log(resp.tester_videos);

    const modifiedArr = resp.tester_videos.map((video) => {
      return {
        duration:
          (new Date(video.endedAt).getTime() -
            new Date(video.startedAt).getTime()) /
          1000,
        ...video,
      };
    });

    this.videoDataSource = new MatTableDataSource(modifiedArr);

    setTimeout(() => {
      this.videoDataSource.paginator = this.videoDataSourcePaginator;
      this.videoDataSource.sort = this.videoDataSourceSort;
    }, 100);
  }

  openVideoModal(recordingId: string) {
    const modalRef = this.modalService.open(TesterVideoModalComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.recordingId = recordingId;
  }

  getDuration(duration?: number) {
    if (!duration) return;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor((duration % 3600) % 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  }
}
