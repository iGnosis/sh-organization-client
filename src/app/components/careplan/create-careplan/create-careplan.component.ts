import { Component, OnInit } from '@angular/core';
import { Activity, ActivityByActivity, CarePlan } from 'src/app/pointmotion';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { CarePlanService } from 'src/app/services/care-plan/care-plan.service';
import { ToastService } from 'src/app/services/toast/toast.service';

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
    { id: 1, name: `Parkinson's` },
    { id: 3, name: `Stroke` },
    { id: 2, name: `Alzheimer's` },
    { id: 4, name: `Others` },
  ]

  activitiesList: Array<Activity> = []

  careplan: CarePlan = {
    careplan_activities: [],
    // name: 'test '+ Math.random(),
    // difficultyLevel: CarePlanDifficulty.easy,
    // medicalConditions: ['Parkinson\'s']
  }

  constructor(
    private carePlanService: CarePlanService, 
    private toastService: ToastService,
    private activityService: ActivityService) { }

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

  async createCarePlan() {
    // console.log(this.careplan);
    // return
    // https://medium.com/@captaindaylight/get-a-subset-of-an-object-9896148b9c72
    const careplan = (({name,medicalConditions,difficultyLevel, estimatedDuration}) => ({name,medicalConditions,difficultyLevel, estimatedDuration}))(this.careplan)
    const result = await this.carePlanService.create(careplan)
    if(result.id) {
      this.toastService.show('Careplan created.')
    }

    // add all the activities to the careplan
    const activities = this.careplan.careplan_activities?.map((x: any) => {
      return {
        activity: x.activityByActivity?.id,
        reps: x.reps,
        careplan: result.id
      }
    })
    
    const m2mResult = await this.carePlanService.attachActivities(activities)
    if(m2mResult) {
      this.toastService.show(`Added ${m2mResult} activities to the Care Plan`)
    }
  }

}
