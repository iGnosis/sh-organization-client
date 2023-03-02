import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  authorizeLink = `https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&redirect_uri=http://localhost:4200/fhir&client_id=21363842-bddb-4fc0-ac5d-b4b068445ece&state=1234&scope=patient.read,patient.search`

  constructor() { }

  ngOnInit(): void {
  }

  openOAuth() {

  }

}
