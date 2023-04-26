import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, map, merge, of, Subscription } from 'rxjs';
import { DashboardMetric, DashboardMetricGroup, DashboardState } from 'src/app/pointmotion';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { dashboard } from 'src/app/store/actions/dashboard.actions';
import { environment } from 'src/environments/environment';

interface DashboardGqlResp {
  metric: string;
  data: DashboardGqlRespData
}

interface DashboardGqlRespData {
  metric: string;
  newCount: number | string;
  percentageChange: number;
  showPercentageChange: boolean;
  tooltip: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  now: Date;
  todayEndDate: Date;
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
  dateSubscription: Subscription;

  metricCards: DashboardMetric[] = [];
  selectedMetricGroup: DashboardMetricGroup = 'conversion';

  constructor(
    private graphqlService: GraphqlService,
    private store: Store<{
      dashboard: DashboardState;
    }>
  ) {
    this.now = new Date();
    this.todayEndDate = new Date(new Date().setHours(24, 0, 0, 0)); // nearest midnight in future
    this.previousDate = new Date(new Date().setHours(0, 0, 0, 0)); // nearest midnight in the past
    console.log('Environment ', environment.name);

    this.dateSubscription = this.store.select('dashboard').subscribe(async (state) => {
      this.selectedDateRange = this.dateFilter.findIndex(
        (item) => item.range === state.dateRange
      );
      await this.updateChartTimeline(state.dateRange);
    });
  }

  async ngOnInit(): Promise<void> {
    this.getNetworkStatus();
  }

  ngOnDestroy(): void {
    this.networkStatusSubscription.unsubscribe();
    this.dateSubscription.unsubscribe();
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
    console.log('updateChartTimeline::range::', range);
    this.previousDate = new Date(this.todayEndDate);
    this.previousDate.setDate(this.previousDate.getDate() - range);

    if (range == 0) {
      this.previousDate = new Date(new Date().setHours(0, 0, 0, 0)); // nearest midnight in the past
    }
    console.log('todayEndDate::', this.todayEndDate);
    console.log('previousDate::', this.previousDate);
    this.metricCards = [];
    await this.getMetrics(this.selectedMetricGroup);
  }

  async setDateFilter(idx: number) {
    this.selectedDateRange = idx;
    const range = this.dateFilter[this.selectedDateRange].range;
    this.store.dispatch(dashboard.setDateRange({ dateRange: range }));
  }

  async getMetrics(metricGroup: DashboardMetricGroup) {
    console.log('getMetrics:: ', metricGroup);
    this.selectedMetricGroup = metricGroup;

    if (metricGroup === 'conversion') {
      const resp: DashboardGqlResp[] = await this.graphqlService.gqlRequest(GqlConstants.DASHBOARD_CONVERSION, { startDate: this.previousDate, endDate: this.todayEndDate });
      this.metricCards = [];
      for (const [_, data] of Object.entries(resp)) {
        this.metricCards.push(this.buildMetricCardObject(data.data));
      }
    }

    else if (metricGroup === 'engagement') {
      const resp: DashboardGqlResp[] = await this.graphqlService.gqlRequest(GqlConstants.DASHBOARD_ENGAGEMENT, { startDate: this.previousDate, endDate: this.todayEndDate });
      this.metricCards = [];
      for (const [_, data] of Object.entries(resp)) {
        this.metricCards.push(this.buildMetricCardObject(data.data));
      }
    }

    else if (metricGroup === 'retention') {
      const resp: DashboardGqlResp[]  = await this.graphqlService.gqlRequest(GqlConstants.DASHBOARD_RETENTION, { startDate: this.previousDate, endDate: this.todayEndDate });
      const today = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
      const todayEnd = new Date(new Date().setHours(24, 0, 0, 0)).toISOString();
      const stickinessResp = await this.graphqlService.gqlRequest(GqlConstants.DASHBOARD_STICKINESS_METRIC, { startDate: today, endDate: todayEnd })
      this.metricCards = [];
      for (const [_, data] of Object.entries(resp)) {
        this.metricCards.push(this.buildMetricCardObject(data.data));
      }
      this.metricCards.push(this.buildMetricCardObject(stickinessResp.stickiness.data));
    }
  }

  buildMetricCardObject(data: DashboardGqlRespData): DashboardMetric  {
    if (data.metric === 'avg_user_engagement') {
      data.newCount = `${data.newCount} mins`;
    }

    const obj: DashboardMetric = {
      // eg. converts string 'new_users' to 'New Users'
      title: data.metric.split('_').map(str => str.charAt(0).toUpperCase() + str.slice(1)).join(' '),
      newCount: data.newCount,
      showPercentageChange: data.showPercentageChange,
      tooltip: data.tooltip,
    }

    switch (data.metric) {
      case 'new_users':
        obj.icon = 'assets/icons/dashboard/new_users.png'
        break;
      case 'activation_milestone':
        obj.icon = 'assets/icons/dashboard/mission.png'
        break;
      case 'avg_user_engagement':
        obj.icon = 'assets/icons/dashboard/meeting_time.png'
        break;
      case 'avg_activities_played':
        obj.icon = 'assets/icons/dashboard/joystick.png'
        break;
      case 'active_users':
        obj.icon = 'assets/icons/dashboard/jump.png'
        break;
      case 'total_users':
        obj.icon = 'assets/icons/dashboard/staff.png'
        break;
      case 'activation_rate':
      case 'adoption_rate':
      case 'stickiness':
        obj.icon = 'assets/icons/dashboard/account.png'
        break;
      default:
        obj.icon = 'assets/icons/dashboard/new_users.png'
        break;
    }

    if (data.showPercentageChange) {
      data.percentageChange > 0 ? obj.isPercentageIncrease = true : obj.isPercentageIncrease = false;
      obj.percentageChange = Math.abs(data.percentageChange);
    }
    return obj;
  }
}
