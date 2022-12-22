import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Chart, ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { fromEvent, map, merge, of, Subscription } from 'rxjs';
import { DashboardState } from 'src/app/pointmotion';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { dashboard } from 'src/app/store/actions/dashboard.actions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  patientAdherenceChart: Chart;
  patientOverviewChart: Chart;

  currentDate: Date;
  previousDate: Date;

  isOnline = false;
  networkStatusSubscription: Subscription;

  dateFilter: { label: string; range: number }[] = [
    { label: 'Today', range: 0 },
    { label: 'Past 7 days', range: 7 },
    { label: 'Past 14 days', range: 14 },
    { label: 'Past 30 days', range: 30 },
    { label: 'Past 90 days', range: 90 },
    { label: 'Past 180 days', range: 180 },
  ];
  selectedDateRange = 0;

  showEmptyState = false;

  constructor(
    private graphqlService: GraphqlService,
    private store: Store<{
      dashboard: DashboardState;
    }>
  ) {
    this.currentDate = new Date();
    this.previousDate = this.currentDate;
    console.log('Environment ', environment.name);

    this.store.select('dashboard').subscribe(async (state) => {
      this.selectedDateRange = this.dateFilter.findIndex(
        (item) => item.range === state.dateRange
      );
      await this.updateChartTimeline(state.dateRange);
    });
  }

  async ngOnInit(): Promise<void> {
    this.getNetworkStatus();
    await this.initPatientAdherenceChart();
    await this.initPatientOverviewChart();
  }

  ngOnDestroy(): void {
    this.networkStatusSubscription.unsubscribe();
  }

  getNetworkStatus() {
    this.isOnline = navigator.onLine;
    this.networkStatusSubscription = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe(status => {
        this.isOnline = status;
      });
  }

  async updateChartTimeline(range: number) {
    this.previousDate = new Date(this.currentDate);
    this.previousDate.setDate(this.previousDate.getDate() - range);

    if (range == 0) this.previousDate = this.currentDate;

    await this.initPatientAdherenceChart();
    await this.initPatientOverviewChart();
  }

  async setDateFilter(idx: number) {
    this.selectedDateRange = idx;
    const range = this.dateFilter[this.selectedDateRange].range;

    this.store.dispatch(dashboard.setDateRange({ dateRange: range }));
    await this.updateChartTimeline(range);
  }

  async initPatientAdherenceChart() {

    const result = await this.graphqlService.gqlRequest(
      GqlConstants.GET_PATIENT_ADHERENCE_CHART,
      {
        startDate: this.previousDate.toISOString(),
        endDate: this.currentDate.toISOString(),
        groupBy: "month",
      }
    );

    if (!result.patientAdherenceChart || !result.patientAdherenceChart.data) return;

    if (result.patientAdherenceChart.data.totalNumOfPatients == 0) this.showEmptyState = true;

    const apiResponse = {
      labels: ['Active Patients', 'Inactive Patients'],
      pieChartDataset: [result.patientAdherenceChart.data.activePatientsCount || 0, result.patientAdherenceChart.data.totalNumOfPatients || 0],
      backgroundColor: ['#ffa2ad', '#2f51ae'],
    }

    const { labels, pieChartDataset, backgroundColor } = apiResponse;

    const data = {
      labels,
      datasets: [
        {
          data: pieChartDataset,
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
            enabled: false
          },
          legend: {
            position: 'bottom',
            labels: {
              padding: 22,
              font: {
                size: 16
              }
            }
          },
          datalabels: {
            font: {
              size: 26,
              weight: 'bold'
            },
            color: ['#000066', '#ffffff'],
            display: function (context) {
              return context.dataset.data[context.dataIndex] !== 0
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    };

    const canvas = <HTMLCanvasElement>(document.getElementById('patientAdherenceChart'));
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.patientAdherenceChart != null) {
        this.patientAdherenceChart.destroy()
      }
      this.patientAdherenceChart = new Chart(ctx, config)
    }
  }

  async initPatientOverviewChart() {

    const result = await this.graphqlService.gqlRequest(
      GqlConstants.GET_PATIENT_OVERVIEW_CHART,
      {
        startDate: this.previousDate.toISOString(),
        endDate: this.currentDate.toISOString(),
      }
    );

    const max_size = 50;
    const chartData =
      !result.patientOverviewChart || !result.patientOverviewChart.data.length ? [
        {
          pid: '',
          x: 0,
          y: 0,
          r: 0,
        }
      ]
      : result.patientOverviewChart.data.map((item: any) => {
        return {
          pid: item.patient,
          x: item.engagementRatio * 100,
          y: item.avgAchievementPercentage,
          r: item.gamesPlayedCount > max_size ? max_size : item.gamesPlayedCount,
        };
      });

      console.log('Patient Overview Chart ', chartData);

    const data = {
      datasets: [
        {
          label: 'Parkinsons',
          data: chartData,
          backgroundColor: '#007f6e',
          clip: false
        }
      ]
    };

    const quadrants = {
      id: 'quadrants',
      beforeDraw(chart: Chart, args: any, options: any) {
        const { ctx, chartArea: { left, top, right, bottom }, scales: { x, y } } = chart;
        const midX = x.getPixelForValue(50);
        const midY = y.getPixelForValue(50);
        ctx.save();
        ctx.fillStyle = options.topLeft;
        ctx.fillRect(left, top, midX - left, midY - top);
        ctx.fillStyle = options.topRight;
        ctx.fillRect(midX, top, right - midX, midY - top);
        ctx.fillStyle = options.bottomRight;
        ctx.fillRect(midX, midY, right - midX, bottom - midY);
        ctx.fillStyle = options.bottomLeft;
        ctx.fillRect(left, midY, midX - left, bottom - midY);
        ctx.restore();
      }
    };

    const config: any = {
      type: 'bubble',
      data: data,
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14
              },
              padding: 8
            }
          },
          quadrants: {
            topLeft: '#fff7e5',
            topRight: '#f0faf4',
            bottomRight: '#fff7e4',
            bottomLeft: '#fdebeb',
          },
          tooltip: {
            events: ["click"],
            displayColors: false,
            titleFont: {
              size: 16
            },
            bodyFont: {
              size: 16
            },
            caretSize: 15,
            callbacks: {
              title: (tooltipItem: any) => tooltipItem[0].dataset.data[tooltipItem[0].dataIndex].pid,
              label: function (tooltipItem: any) {
                const dataIndex = tooltipItem.dataIndex
                const data = tooltipItem.dataset.data[dataIndex]
                return `Number of Activities: ${data.r}`
              },
              afterLabel: (tooltipItem: any) => {
                const sessionCompletionStr = `Session Completion Rate: ${tooltipItem.dataset.data[tooltipItem.dataIndex].x}%`
                const achievementRatioStr = `Achievement Ratio: ${tooltipItem.dataset.data[tooltipItem.dataIndex].y}%`
                return sessionCompletionStr + '\n' + achievementRatioStr
              },
            }
          }
        },
        scales: {
          y: {
            max: 100,
            beginAtZero: true,
            ticks: {
              stepSize: 20,
            },
            title: {
              display: true,
              padding: 12,
              text: 'Achievement Ratio',
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          },
          x: {
            max: 100,
            beginAtZero: true,
            ticks: {
              stepSize: 20,
            },
            title: {
              display: true,
              padding: 12,
              text: 'Session Completion',
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          }
        }
      },
      plugins: [quadrants]
    };

    const canvas = <HTMLCanvasElement>(document.getElementById('patientOverviewChart'));
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.patientOverviewChart != null) {
        this.patientOverviewChart.destroy()
      }
      this.patientOverviewChart = new Chart(ctx, config)
    }
  }
}
