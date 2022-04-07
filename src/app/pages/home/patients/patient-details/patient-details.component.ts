import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { Patient } from 'src/app/types/patient';
import { Session } from 'src/app/types/session';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {

  itemsPerPage = 10
  currentPage = 1
  isRowsChecked = false

  patientId?: string
  details?: Patient
  totalSessionsCount?: number
  sessionDetails?: Array<Session>

  // sessionDetails = [
  //   {
  //     id: '2d01273f-d40b-42d7-bfdb-76843668accb', // sessionId
  //     carePlan: 'Music and Movement',
  //     activityType: 'Physical',
  //     timeDuration: '20 minutes',
  //     createdDate: 'Jan 20, 2022',
  //     performance: 70
  //   },
  //   {
  //     id: '2d01273f-1234-42d7-bfdb-76843668accb', // sessionId
  //     carePlan: 'Cognitive Skills',
  //     activityType: 'Memory',
  //     timeDuration: '15 minutes',
  //     createdDate: 'Jan 24, 2022',
  //     performance: 45
  //   }
  // ]


  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.patientId = params.get('id') || ''
      if (this.patientId) {
        console.log('patientId:', this.patientId);
        this.fetchSessions(0)
      }
    })
  }

  async fetchSessions(offset: number) {
    // we need to show sessions of a patient.
    let sessions = await GraphqlService.client.request(GqlConstants.GET_SESSIONS,
      {
        patientId: this.patientId,
        limit: this.itemsPerPage,
        offset
      }
    )
    console.log('fetchSessions:', sessions)
    const totalSessionsCount = sessions.session_aggregate.aggregate.count
    console.log('fetchSessions:totalSessionsCount:', totalSessionsCount)
    this.totalSessionsCount = totalSessionsCount

    // Array of sessions
    sessions = sessions.session

    const sessionIds = sessions.map((session: Session) => session.id)
    console.log('fetchSessions:sessionIds:', sessionIds)

    sessions.forEach((val: Session) => {
      // work out time duration
      if (val.createdAt && val.endedAt) {
        const createdAtMilliSec: number = new Date(val.createdAt).getTime()
        const endedAtMilliSec: number = new Date(val.endedAt).getTime()
        const seconds = (endedAtMilliSec - createdAtMilliSec) / 1000
        val.timeDuration = this.secondsToString(seconds)
      }
    })
    this.sessionDetails = sessions
  }

  secondsToString(seconds: number): string {
    const numMinutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60)
    return `${numMinutes} minutes`
  }

  async createNewSessionAndRedirect() {
    const sessionId = await this.createNewSession()
    this.goToLink(`${environment.activityEndpoint}?sessionId=${sessionId}`)
  }

  async createNewSession() {
    const session = await GraphqlService.client.request(GqlConstants.CREATE_SESSION, { patient: this.patientId, careplan: '4e2aa726-b07f-4f44-a4fd-fc228c93bfc7' })
    if (
      session &&
      session.insert_session &&
      session.insert_session.returning &&
      Array.isArray(session.insert_session.returning) &&
      session.insert_session.returning.length == 1 &&
      session.insert_session.returning[0].id
    ) {
      const sessionId = session.insert_session.returning[0].id
      console.log('createSessionAndRedirect:sessionId', sessionId)
      return sessionId
    }
  }

  goToLink(url: string) {
    console.log(`goToLink:Redirecting user to ${url}...`)
    window.open(url, '_blank')
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

  pageChanged(pageNumber: any) {
    console.log('pageChanged:', pageNumber)
    this.currentPage = pageNumber
    this.fetchSessions(pageNumber * this.itemsPerPage)
  }
}
