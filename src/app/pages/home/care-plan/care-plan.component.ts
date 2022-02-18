import { Component, OnInit } from '@angular/core';
import { CarePlanService } from 'src/app/services/care-plan/care-plan.service';
import { CarePlan } from 'src/app/types/careplan';

@Component({
  selector: 'app-care-plan',
  templateUrl: './care-plan.component.html',
  styleUrls: ['./care-plan.component.scss']
})
export class CarePlanComponent implements OnInit {

  allMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"]
  selectedMedicalConditions = ["Parkinson's", "Huntington's", "Alzheimer's", "Others"]
  careplans: Array<CarePlan> = []
  constructor(private careplanService: CarePlanService) { }

  async ngOnInit() {
    this.careplans = await this.careplanService.getAll()
    console.log(this.careplans);
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
