import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.scss']
})
export class PatientAddComponent implements OnInit {

  medicalConditionsList:any = []
  selectedMedicalConditions:any = []
  dropdownSettings:IDropdownSettings = {}
  availableGenres: any = []
  selectedGenres: any = []

  availableCarePlans: any = []
  selectedCarePlans: any = []

  constructor() { }

  ngOnInit(): void {
    this.medicalConditionsList = [
      { id: 1, name: `Parkinson's` },
      { id: 2, name: `Alzheimer's` },
      { id: 3, name: `Huntington's` },
    ];
    this.availableGenres = [
      {id: 1, name: 'Rock'},
      {id: 1, name: 'Classical'},
      {id: 1, name: 'Jazz'},
      {id: 1, name: 'Pop'}
    ]
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
  }

}
