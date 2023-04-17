import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CarePlanService } from 'src/app/services/care-plan/care-plan.service';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants'
import { CarePlan } from 'src/app/pointmotion';
@Component({
  selector: 'app-careplans-list',
  templateUrl: './careplans-list.component.html',
  styleUrls: ['./careplans-list.component.scss']
})
export class CareplansListComponent implements OnInit {
  careplans: Array<CarePlan> = []
  @Input() patientId = ''
  @Input() options = {}
  @Output() selected = new EventEmitter<any>()

  constructor(private careplanService: CarePlanService, private graphqlService: GraphqlService) { }

  async ngOnInit() {
    const assignedCareplansIds: Array<string> = []
    console.log(this.patientId,"patientid");
    // if (this.patientId) {
    //   let assignedCareplans = await this.graphqlService.client.request(GqlConstants.GET_PATIENT_CAREPLANS,
    //     { patientId: this.patientId }
    //   )
    //   console.log('assignedCareplans:', assignedCareplans)
    //   assignedCareplans = assignedCareplans.patient_by_pk.patient_careplans

    //   assignedCareplansIds = assignedCareplans.map((careplan: any) => careplan.careplanByCareplan.id)
    //   console.log('assignedCareplansIds:', assignedCareplansIds)
    // }

    const allCareplans = await this.careplanService.getAll()
    allCareplans.forEach((careplan: any) => {
      if (assignedCareplansIds.includes(careplan.id)) {
        careplan.selected = true
      }
    })
    this.careplans = allCareplans
  }

  async getSelectedCarePlans() {

  }

  onCarePlanSelected(event: any, careplan: any) {
    this.selected.emit({ checked: event.target.checked, items: [careplan] })
  }

  onSelectAllChanged(event: any) {
    this.selected.emit({ checked: event.target.checked, items: this.careplans })
    this.careplans.forEach(cp => cp.selected = event.target.checked)
  }

}
