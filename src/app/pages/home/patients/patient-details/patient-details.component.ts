import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { Patient } from 'src/app/types/patient';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  isRowsChecked = false
  id?: string
  details?: Patient

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.id = params.get('id') || ''
      if (this.id) {
        const response = await GraphqlService.client.request(GqlConstants.GET_PATIENT_DETAILS, { user: this.id })
        this.details = response.user_by_pk
        console.log(this.details)
      }
    })
  }

  toogleRowsCheck() {
    const formCheckinputs = document.querySelectorAll('.row-check-input')
    if (this.isRowsChecked) {
      formCheckinputs.forEach(arr => {
        arr.removeAttribute('checked')
      })
    } else {
      formCheckinputs.forEach(arr => {
        arr.setAttribute('checked', '')
      })
    }
    this.isRowsChecked = !this.isRowsChecked
  }
}
