import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  activities = [
    {
      name: 'Warm up',
      img: 'https://picsum.photos/id/1025/300/300',
      time: '3:00'
    },
    {
      name: 'Arm Stretch',
      img: 'https://picsum.photos/id/1025/300/300',
      time: '2:30'
    },
    {
      name: 'Leg Stretch',
      img: 'https://picsum.photos/id/1025/300/300',
      time: '3:15'
    },
    {
      name: 'Hallelujah',
      img: 'https://picsum.photos/id/1025/300/300',
      time: '5:00'
    },
    {
      name: 'Plank',
      img: 'https://picsum.photos/id/1025/300/300',
      time: '2:00'
    },
    {
      name: 'Jumping',
      img: 'https://picsum.photos/id/1025/300/300',
      time: '3:00'
    },
    {
      name: 'Backflip',
      img: 'https://picsum.photos/id/1025/300/300',
      time: '10:00'
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
