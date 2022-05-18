import { Component, OnInit, ViewChild } from '@angular/core';
import { CarePlanService } from 'src/app/services/care-plan/care-plan.service';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, Sort, SortDirection} from '@angular/material/sort';
import { CarePlan } from 'src/app/pointmotion';
@Component({
  selector: 'app-care-plan',
  templateUrl: './care-plan.component.html',
  styleUrls: ['./care-plan.component.scss']
})
export class CarePlanComponent implements OnInit {
  selection:any;
  row : any;
  initialSelection = [];
  allowMultiSelect = true;
  displayedColumns: string[] = ['total_count','name','estimatedDuration','careplan_activities_aggregate','difficultyLevel','user_careplans_aggregate','actions'];
  dataSource = new MatTableDataSource();
  @ViewChild('TableOnePaginator', { static: true }) tableOnePaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  allMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"]
  selectedMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"]
  careplans: Array<CarePlan> = []
  constructor(private careplanService: CarePlanService) { }

  async ngOnInit() {
    this.careplans = await this.careplanService.getAll();
    this.dataSource.data=this.careplans;
    console.log(this.dataSource.data);
    this.selection = new SelectionModel(this.allowMultiSelect, this.initialSelection);
    this.dataSource.paginator = this.tableOnePaginator;
    this.dataSource.sort = this.sort;
  }

  async reloadCarePlans(filters:any) {
    this.careplans = await this.careplanService.getAll()
  }


  selectDataSegment(condition: string) {
    this.selectedMedicalConditions = [condition]
    this.reloadCarePlans({})
  }

  onCarePlansSelected(careplans: any) {
    console.log(careplans)
  }
}
