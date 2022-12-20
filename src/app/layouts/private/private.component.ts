import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, Subscription, take } from 'rxjs';
import { ModalConfig } from 'src/app/pointmotion';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { InvitePatientComponent } from 'src/app/widgets/modal/invite-patient/invite-patient.component';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {
  logoUrl = "assets/images/logo-white.png";
  logoutModalConfig: ModalConfig;
  @ViewChild('logoutModal') logoutModal: TemplateRef<any>;

  constructor(private themeService: ThemeService, private router: Router, private modalService: NgbModal) {
    this.themeService.logoSubject.pipe(take(1)).subscribe((url) => this.logoUrl = url);
    this.logoutModalConfig = {
      type: 'primary',
      title: 'Log Out from Sound Health',
      body: 'Are you sure you want to leave Sound Health?',
      closeButtonLabel: 'Cancel',
      submitButtonLabel: 'Log Out',
      onSubmit: this.logout.bind(this),
    };
  }

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

  openLogoutModal() {
    this.modalService.open(this.logoutModal, { centered: true, size: 'md' })
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['/public/auth/sign-in'])
    this.modalService.dismissAll()
  }
}
