import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  code: string
  accessToken: string

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  async ngOnInit() {
    // Check the params to get the auth code
    this.code = this.route.snapshot.queryParams['code']

    if (this.code) {
      const body = new URLSearchParams();
      body.set('grant_type', 'authorization_code');
      body.set('redirect_uri', 'http://localhost:4200/fhir');
      body.set('code', this.code);
      body.set('client_id', '21363842-bddb-4fc0-ac5d-b4b068445ece');
      body.set('state', '1234');

      this.http.post('https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token', body.toString() , {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).subscribe(response => {
        console.log(response);
        
      })
    }
  }

}
