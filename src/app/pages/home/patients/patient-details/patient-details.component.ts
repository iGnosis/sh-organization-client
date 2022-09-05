import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { Chart, ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartService } from 'src/app/services/chart/chart.service';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableFilter } from 'mat-table-filter';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StartSessionPopUp } from '../start-session/start-session-popup.component';
import { EventEmitterService } from 'src/app/services/eventemitter/event-emitter.service';
import { CarePlanService } from 'src/app/services/care-plan/care-plan.service';
import { SessionService } from 'src/app/services/session/session.service';
import {
  AchievementRatio,
  EngagementRatio,
  Game,
  Patient,
  Session,
} from 'src/app/pointmotion';
import { AddCareplan } from '../add-careplan/add-careplan-popup.component';

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
export class PatientDetailsComponent implements OnInit {
  isShowDiv = true;
  selected: any;
  isShowFilter = true;
  allowMultiSelect: boolean | undefined;
  initialSelection: unknown[] | undefined;
  activeCarePlans: any | undefined;
  patientIdentifier: any | undefined;
  getActivityCount: number;
  getEstimatedActivityDuration: number;
  // getCarePlanCount : number;

  toggleFilterDiv() {
    this.isShowFilter = !this.isShowFilter;
  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  searchValue: any;
  itemsPerPage = 10;
  currentPage = 1;
  isRowsChecked = false;
  achievementChart: Chart;
  engagementChart: Chart;
  startDate?: Date;
  endDate?: Date;
  noSessionAssignedPlan: number;
  // code for mat tab starts here
  @ViewChild('TableOnePaginator', { static: true })
  tableOnePaginator: MatPaginator;
  selection: any;
  row: any;
  dataSource = new MatTableDataSource<Game>();
  filterEntity: SpaceCraft;
  filterType: MatTableFilter;
  displayedColumns: string[] = [
    'total_count',
    'label_star',
    'careplanByCareplan',
    'activity_type',
    'timeDuration',
    'createdAt',
    'totalPerformanceRatio',
    'activity_action',
  ];
  // displayedColumns: string[] = ['total_count','label_star', 'care_plan', 'activity_type', 'activity_time','activity_date','activity_performance','activity_action'];
  // code for mat tab ends here

  patientId?: string;
  details?: Patient;
  totalGamesCount?: number;
  gameDetails: Array<Game>;
  selectedCarePlanId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private analyticsService: AnalyticsService,
    private carePlanService: CarePlanService,
    private graphqlService: GraphqlService,
    private sessionService: SessionService,
    private chartService: ChartService,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private modalService: NgbModal,
    public eventEmitterService: EventEmitterService
  ) {}

  //@ViewChild('callStartNewSessionModal') callStartNewSessionModal: TemplateRef<any>;

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
        console.log('patientId:', this.patientId);
        // this.eventEmitterService.SentPatientID({data:this.patientId});
        await this.fetchSessions(0);
        await this.GetAssignedCarePlan();

        // by default, get data for past 7 days
        this.endDate = new Date();
        this.startDate = new Date(new Date().setDate(new Date().getDate() - 7));
        this.initAchievementChart(
          this.startDate.toISOString(),
          this.endDate.toISOString()
        );
        this.initEngagementChart(
          this.startDate.toISOString(),
          this.endDate.toISOString()
        );
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(StartSessionPopUp);
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
    this.eventEmitterService.SentPatientID(this.patientId);
  }

  openCarePlanDialog() {
    const dialogRef = this.dialog.open(AddCareplan);
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
    this.eventEmitterService.SentPatientID(this.patientId);
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openCarePlanDetails(id: string) {
    this.router.navigate(['/app/care-plans/', id]);
  }

  async fetchSessions(offset: number) {
    // we need to show sessions of a patient.
    let games = await this.graphqlService.client.request(
      GqlConstants.GET_GAMES,
      {
        patientId: this.patientId,
        limit: this.itemsPerPage,
        offset,
      }
    );

    console.log('offset:', offset);
    console.log('fetchSessions:', games);

    this.totalGamesCount = games.game_aggregate.aggregate.count;
    console.log('fetchSessions:totalSessionsCount:', this.totalGamesCount);

    // Array of sessions
    games = games.game;

    if (!games) return;

    games.forEach((val: Session) => {
      // work out time duration
      if (val.createdAt && val.endedAt) {
        val.timeDuration = this.analyticsService.calculateTimeDuration(
          val.createdAt,
          val.endedAt
        );
      }
    });

    this.gameDetails = games;

    // fetching analytics data for sessions
    const gameIds = games.map((game: Game) => game.id);
    console.log('fetchSessions:sessionIds:', gameIds);

    // TODO: Calculate and show the performance ratio in the sessions/games table
    // this.analyticsService.getAnalytics(gameIds).subscribe((sessionAnalytics: any) => {
    //   console.log('fetchSessions:getAnalytics:', sessionAnalytics)

    //   games.forEach((val: Session) => {
    //     if (val.id && val.id in sessionAnalytics) {
    //       let performanceRatio = 0
    //       let totalEventsPerSession = 0
    //       let avgReactionTime = 0

    //       const session = sessionAnalytics[val.id]
    //       val.sessionAnalytics = session

    //       for (const activity in session) {
    //         for (const event of session[activity].events) {
    //           // console.log('event:', event)
    //           performanceRatio += event.score * 100
    //           avgReactionTime += event.reactionTime
    //           totalEventsPerSession++
    //         }
    //       }
    //       performanceRatio = performanceRatio / totalEventsPerSession
    //       performanceRatio = Math.round(performanceRatio * 100) / 100
    //       val.totalPerformanceRatio = performanceRatio
    //       val.avgReactionTime = parseFloat((avgReactionTime / totalEventsPerSession).toFixed(2))
    //     }
    //   })

    //   this.gameDetails = games
    //   console.log('sessionDetails:', this.gameDetails)
    // })

    this.dataSource.data = this.gameDetails;
    //console.log(this.dataSource.data, ">>>>>>>");

    const identifier_response = await this.graphqlService.client.request(
      GqlConstants.GET_PATIENT_IDENTIFIER,
      { patientId: this.patientId }
    );
    this.patientIdentifier = identifier_response.patient[0].identifier;
    //console.log(this.patient_identifier,'getpatient');

    //console.log(this.active_careplans[0].careplanByCareplan.careplan_activities_aggregate.aggregate.count,'getcount')
  }

  async GetAssignedCarePlan() {
    const response = await this.graphqlService.client.request(
      GqlConstants.GET_ACTIVE_PLANS,
      { patient: this.patientId }
    );
    this.activeCarePlans = response.patient[0].patient_careplans;
    //console.log(this.active_careplans.length,"length");
    // this.getCarePlanCount = this.activeCarePlans.length;
    console.log(this.dataSource.data.length, 'length');
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
          backgroundColor: '#000066',
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

    console.log('initEngagementChart:results:', chartResults);

    for (const key in chartResults) {
      data.labels.push(key.split('T')[0].split('-')[2]);
      data.datasets[0].data.push(chartResults[key]);
    }

    console.log('initEngagementChart:labels:', data.labels);
    console.log('initEngagementChart:labels:', data.datasets[0].data);

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

  async initAchievementChart(startDate: string, endDate: string) {
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
            display: false,
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

    const achievementRatioData =
      await this.chartService.fetchPatientChartableData(
        startDate,
        endDate,
        userTimezone,
        this.patientId!,
        'avgAchievementRatio',
        'day',
        false
      );

    console.log('achievementRatioData::', achievementRatioData);

    const chartResults: {
      avgAchievementPercentage: string;
      createdAt: string;
    }[] = achievementRatioData.patientChart.data.results;

    chartResults.map((result) => {
      data.labels.push(result.createdAt.split('T')[0].split('-')[2]);
      data.datasets[0].data.push(result.avgAchievementPercentage);
    });

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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.tableOnePaginator;
    localStorage.getItem('reload');
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

  async pageChanged(pageNumber: any) {
    console.log('pageChanged:', pageNumber);
    await this.fetchSessions((pageNumber - 1) * this.itemsPerPage);
    this.currentPage = pageNumber;
  }

  // changeSessionsChart() {
  //   const sessionVal = (<HTMLInputElement>document.getElementById('sessionVal')).value
  //   console.log('changeFinancials:', sessionVal)
  //   this.achievementChart.config.options.parsing.yAxisKey = `data.${sessionVal}`
  //   this.achievementChart.update()
  // }

  openSessionDetailsPage(sessionId: string) {
    this.router.navigate(['/app/sessions/', sessionId]);
  }
}
