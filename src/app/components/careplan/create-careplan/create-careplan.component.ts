import { Component, OnInit } from '@angular/core';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { CarePlanService } from 'src/app/services/care-plan/care-plan.service';
import { Activity } from 'src/app/types/activity';
import { ActivityByActivity, CarePlan, CarePlanDifficulty } from 'src/app/types/careplan';

@Component({
  selector: 'app-create-careplan',
  templateUrl: './create-careplan.component.html',
  styleUrls: ['./create-careplan.component.scss']
})
export class CreateCareplanComponent implements OnInit {

  dropdownSettings = {
    singleSelection: false,
    idField: 'name',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true
  }

  medicalConditionsList = [
    { name: `Parkinson's` },
    { name: `Alzheimer's` },
    { name: `Huntington's` },
    { name: `Others` },
  ]

  activitiesList: Array<Activity> = []

  careplan:CarePlan = {
    careplan_activities: []
  }

  constructor(private carePlanService: CarePlanService, private activityService: ActivityService) { }

  async ngOnInit() {
    this.activitiesList = await this.activityService.getAll()
    console.log(this.activitiesList)
  }

  addActivityToCarePlan(activity:any) {
    activity.selected = !activity.selected;
    if(activity.selected) {
      // Make it compliant to GraphQL response
      this.careplan.careplan_activities?.push({activityByActivity: activity, reps:1})
      console.log(this.careplan.careplan_activities);
    } else {
      // Find the index of the activity
      this.removeActivityFromList(activity)
    }
    this.calculateTotalCarePlanDuration()
  }

  removeActivityFromList(activity: any) {
    // const index = this.careplan.careplan_activities?.map(x => x.activityByActivity).indexOf(activity) || -1
    const idx = this.careplan.careplan_activities?.findIndex(x => {
      console.log(x);
      if (x.activityByActivity?.id == activity.id) {
        console.log('found match');
        return true
      } else {
        return false
      }
    }) ?? -1 // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
    console.log('removeActivityFromList');
    console.log('this.careplan.careplan_activities', this.careplan.careplan_activities);
    console.log('activity', activity);
    // debugger
    console.log('idx', idx);
    
    if (idx !== -1) {
      this.careplan.careplan_activities?.splice(idx, 1)  
    }
    this.calculateTotalCarePlanDuration()
  }

  incrementReps(activity: ActivityByActivity) {
    activity.reps = (activity.reps || 1) + 1
    this.calculateTotalCarePlanDuration()
  }

  decrementReps(activity: ActivityByActivity) {
    if (activity.reps && activity.reps == 1) {
      if (activity.activityByActivity){
        // update the all activities list
        activity.activityByActivity.selected = !activity?.activityByActivity?.selected;
      }
      this.removeActivityFromList(activity.activityByActivity)
    }

    activity.reps = (activity.reps || 1) - 1
    this.calculateTotalCarePlanDuration()
  }

  calculateTotalCarePlanDuration() {
    let totalDuration = 0;
    this.careplan.careplan_activities?.forEach(x => {
      totalDuration += (x.reps || 1) * (x.activityByActivity?.duration || 0)
    })
    
    this.careplan.estimatedDuration = totalDuration
  }

}
