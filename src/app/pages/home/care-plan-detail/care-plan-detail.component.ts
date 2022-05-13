import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, Sort, SortDirection} from '@angular/material/sort';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
@Component({
  selector: 'app-care-plan',
  templateUrl: './care-plan-detail.component.html',
  styleUrls: ['./care-plan-detail.component.scss']
})

export class CarePlanDetailComponent implements OnInit {
  @Input() public hoverClassName: string;
public hovered: boolean;
  carePlan?: string;
  carePlanName?:string;
  activityList : any | undefined=[];
  patientList : any | undefined=[];
  isShowCareplan = true;
  isShowToggle=false;
  showActivity=false;
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
  constructor(private graphqlService: GraphqlService,private route: ActivatedRoute,) { }
  toggleFilterDiv() {
    this.isShowCareplan = !this.isShowCareplan;
  }
  async ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.carePlan = params.get('id') || ''
      if (this.carePlan) {
        console.log('carePlan:', this.carePlan);
      }
    })
    const response = await this.graphqlService.client.request(GqlConstants.GETCAREPLANDETAILS, { careplan: this.carePlan})
    this.carePlanName=response.careplan[0].name;
    this.activityList=response.careplan[0].careplan_activities;
    this.patientList=response.careplan[0].patient_careplans;
    console.log(this.activityList);
    if(this.patientList.length<6){
      this.isShowToggle=false;
    }
    else{
      this.isShowToggle=true;
    }
    if(this.activityList.length<=2){
      this.showActivity=false;
    }
    else{
      this.showActivity=true;
    }
  }
}
