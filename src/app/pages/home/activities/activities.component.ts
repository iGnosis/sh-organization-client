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
    },
    {
      name: 'Arm Stretch',
      img: 'https://picsum.photos/id/1025/300/300',
    },
    {
      name: 'Leg Stretch',
      img: 'https://picsum.photos/id/1025/300/300',
    },
    {
      name: 'Hallelujah',
      img: 'https://picsum.photos/id/1025/300/300',
    },
    {
      name: 'Plank',
      img: 'https://picsum.photos/id/1025/300/300',
    },
    {
      name: 'Jumping',
      img: 'https://picsum.photos/id/1025/300/300',
    },
    {
      name: 'Backflip',
      img: 'https://picsum.photos/id/1025/300/300',
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
