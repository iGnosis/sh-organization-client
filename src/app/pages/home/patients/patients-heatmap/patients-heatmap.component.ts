import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/chart/chart.service';

@Component({
  selector: 'patient-goals-heatmap',
  templateUrl: './patients-heatmap.component.html',
  styleUrls: ['./patients-heatmap.component.scss']
})
export class PatientsHeatmapComponent implements OnInit {
  totalGames = 3;
  totalPages = 0;
  chartData: any[];
  sortBy: 'recentActivity' | 'overallActivity' = 'recentActivity';
  sortDirection: 'asc' | 'desc' = 'desc';
  showInactive = true;
  limit = 10;
  offset = 0;
  constructor(private chartService: ChartService) {
  }

  async ngOnInit(): Promise<void> {
    this.getHeatmapData();
  }

  async getHeatmapData(): Promise<void> {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth() - 2, 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const response = await this.chartService.fetchPatientMonthlyCompletionData(
      firstDay.toISOString(),
      lastDay.toISOString(),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      this.sortBy,
      this.sortDirection,
      this.limit.toString(),
      (this.offset * this.limit).toString(),
      this.showInactive,
    );
    if (response && response.patientMonthlyCompletion && response.patientMonthlyCompletion.data && response.patientMonthlyCompletion.data.results) {
      this.chartData = response.patientMonthlyCompletion.data.results.result;
      this.totalPages = response.patientMonthlyCompletion.data.results.pages;
    }
  }

  getName(patient: any) {
    const id = Object.keys(patient)[0]; 
    return (patient[id][0] && patient[id][0].nickname) || id;
  }

  setPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.offset = page;
      this.getHeatmapData();
    }
  }

  initHeatmap(obj: any): any[] {
    const arr = obj[Object.keys(obj)[0]];
    const noOfDaysInMonth = new Date(2022, new Date().getMonth() + 1, 0).getDate();
    let monthlyData = [...Array(noOfDaysInMonth).map(() => {})]; // create an array of empty objects
    monthlyData = monthlyData.map((_, i) => { // map the array to fill in the data on corresponding dates
      const d = arr.map(({createdAt}: any) => new Date(createdAt).getDate()).indexOf(i+1);
      if (d !== -1) {
        return arr[d];
      }
    });
    return monthlyData;
  }

  completionColor(day: any): string {
    if (day && day.gamesCompleted) {
      const completionPercentage = Math.min((Number(day.gamesCompleted)/this.totalGames) * 100, 100); // max 100%
      return 'hsl(155,' + completionPercentage +'%,50%,1)';
    } else {
      return 'hsl(0,0%,80%,1)';
    }
  }

}
