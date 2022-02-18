import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CarePlanService } from 'src/app/services/care-plan/care-plan.service';
import { CarePlan } from 'src/app/types/careplan';

@Component({
  selector: 'app-careplans-list',
  templateUrl: './careplans-list.component.html',
  styleUrls: ['./careplans-list.component.scss']
})
export class CareplansListComponent implements OnInit {
  careplans: Array<CarePlan> = []
  @Input() options = {}
  @Output() selected = new EventEmitter<any>()

  constructor(private careplanService: CarePlanService) { }

  async ngOnInit() {
    this.careplans = await this.careplanService.getAll()
  }

  onCarePlanSelected(event:any, careplan: any) {
    this.selected.emit({checked: event.target.checked, items: [careplan]})
  }

  onSelectAllChanged(event: any) {
    this.selected.emit({checked: event.target.checked, items: this.careplans})
    this.careplans.forEach(cp => cp.selected = event.target.checked)
  }

}
