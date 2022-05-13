import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  patientAdherenceCtx: any
  patientAdherenceCanvas: HTMLCanvasElement
  currentDate: Date

  constructor() {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.initPatientAdherenceChart();
    this.initPatientOverviewChart();
  }

  initPatientAdherenceChart() {
    const data = {
      labels: ['Active Patients', 'Inactive Patients'],
      datasets: [
        {
          data: [11, 4],
          backgroundColor: ['#ffa2ad', '#2f51ae'],
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
            color: ['#000066', '#ffffff']
          }
        }
      },
      plugins: [ChartDataLabels]
    };
    this.patientAdherenceCanvas = <HTMLCanvasElement>(document.getElementById('patientAdherence'));
    this.patientAdherenceCtx = this.patientAdherenceCanvas.getContext('2d');

    if (this.patientAdherenceCtx) {
      new Chart(this.patientAdherenceCtx, config);
    }
  }

  initPatientOverviewChart() {
    const data = {
      datasets: [{
        label: 'Dementia',
        data: [
          { x: 20, y: 30, r: 10, pid: 'john' },
          { x: 40, y: 10, r: 25, pid: 'jane' },
          { x: 55, y: 47, r: 18, pid: 'han' }
        ],
        backgroundColor: '#2f51ae',
        clip: false
      },
      {
        label: 'Alzheimers',
        data: [
          { x: 80, y: 30, r: 10, pid: 'corey' },
          { x: 80, y: 10, r: 15, pid: 'mike' }
        ],
        backgroundColor: '#007f6e',
        clip: false
      },
      {
        label: 'Parkinsons',
        data: [
          { x: 100, y: 10, r: 10, pid: 'vader' },
          { x: 42, y: 90, r: 15, pid: 'leia' }
        ],
        backgroundColor: '#ffa2ad',
        clip: false
      }]
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
            position: 'right',
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

    const canvas = <HTMLCanvasElement>(document.getElementById('patientOverview'));
    const ctx = canvas.getContext('2d');
    if (ctx) {
      new Chart(ctx, config);
    }
  }
}
