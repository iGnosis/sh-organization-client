import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';
import { InvitePatientComponent } from 'src/app/widgets/modal/invite-patient/invite-patient.component';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
          if (event.url == '/app') {
            this.router.navigate(['/'])
          }
      }
  });

  }

  // invitePatient() {
  //   const modalRef = this.modalService.open(InvitePatientComponent)
  // }

  logout() {
    localStorage.clear()
    this.router.navigate(['/public/auth/sign-in'])
  }
}
