import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'pmc-active-patients',
  templateUrl: './active-patients.component.html',
  styleUrls: ['./active-patients.component.scss']
})
export class ActivePatientsComponent implements OnInit {
  
  @ViewChild('chart')
  canvas!: ElementRef<HTMLCanvasElement>;

  constructor() {}
  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const ctx = this.canvas.nativeElement.getContext('2d')
    const myChart = new Chart(ctx || null as any, {
      type: 'line',
      data: {
        datasets: [{
          data: [{x: 1, y: 20}, {x: 2, y: 1}, {x: 3, y: 10}, {x: 4, y: 10}]
        }],
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    
    });
  }
  
}
