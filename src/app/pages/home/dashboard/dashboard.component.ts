import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  patientAdherenceCtx: any
  patientAdherenceCanvas: any

  constructor() { }

  ngOnInit(): void {
    this.initPatientAdherenceChart();
    this.initPatientOverviewChart();
  }

  initPatientAdherenceChart() {
    const data = {
      labels: ['Inactive Patients', 'Active Patients'],
      datasets: [
        {
          data: [4, 11],
          backgroundColor: ['#2f51ae', '#ffa2ad'],
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
            enabled: true
          },
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 16
              }
            }
          },
        },
        animation: {
          onProgress: (event) => {
            this.drawSegmentValues(event.chart)
          }
        }
      }
    };
    this.patientAdherenceCanvas = <HTMLCanvasElement>(document.getElementById('patientAdherence'));
    this.patientAdherenceCtx = this.patientAdherenceCanvas.getContext('2d');

    if (this.patientAdherenceCtx) {
      new Chart(this.patientAdherenceCtx, config);
    }
  }

  drawSegmentValues(chart: any) {
    chart._sortedMetasets[0].data.forEach((data: any) => {
      this.patientAdherenceCtx.fillStyle = 'white';
      const textSize = this.patientAdherenceCanvas.width / 10;
      this.patientAdherenceCtx.font = textSize + "px Verdana";

      const value = data.$context.raw;
      const startAngle = data.startAngle;
      const endAngle = data.endAngle;
      const middleAngle = startAngle + ((endAngle - startAngle) / 2);

      const midX = this.patientAdherenceCanvas.width / 2;
      const midY = this.patientAdherenceCanvas.height / 2

      // compute text location
      const posX = (data.outerRadius / 2) * Math.cos(middleAngle) + midX;
      const posY = (data.outerRadius / 2) * Math.sin(middleAngle) + midY;

      // Text offside to middle of text
      const w_offset = this.patientAdherenceCtx.measureText(value).width / 2;
      const h_offset = textSize / 4;
      this.patientAdherenceCtx.fillText(value, posX - w_offset, posY + h_offset);
    })
  }

  initPatientOverviewChart() {
    const data = {
      datasets: [{
        label: 'Dementia',
        data: [
          { x: 20, y: 30, r: 10 },
          { x: 40, y: 10, r: 25 },
          { x: 55, y: 47, r: 18 }
        ],
        backgroundColor: '#2f51ae',
        clip: false
      },
      {
        label: 'Alzheimers',
        data: [
          { x: 80, y: 30, r: 10 },
          { x: 80, y: 10, r: 15 }
        ],
        backgroundColor: '#007f6e',
        clip: false
      },
      {
        label: 'Parkinsons',
        data: [
          { x: 100, y: 10, r: 10 },
          { x: 42, y: 90, r: 15 }
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
          }
        },
        scales: {
          y: {
            max: 100,
            beginAtZero: true,
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
