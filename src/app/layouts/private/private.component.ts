import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvitePatientComponent } from 'src/app/widgets/modal/invite-patient/invite-patient.component';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // invitePatient() {
  //   const modalRef = this.modalService.open(InvitePatientComponent)
  // }

  logout() {
    localStorage.clear()
    this.router.navigate(['/'])
  }
}
