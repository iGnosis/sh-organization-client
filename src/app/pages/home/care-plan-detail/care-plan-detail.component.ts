import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, Sort, SortDirection} from '@angular/material/sort';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-care-plan',
  templateUrl: './care-plan-detail.component.html',
  styleUrls: ['./care-plan-detail.component.scss']
})
export class CarePlanDetailComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>'
  ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 3,
        margin: 30,
      }
    },
    nav: true,
  }
  constructor() { }

  async ngOnInit() {
  }
}
