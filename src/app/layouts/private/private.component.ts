import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs';
import { ModalConfig } from 'src/app/pointmotion';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {
  logoUrl = "assets/images/sh_logo_white.png";
  logoutModalConfig: ModalConfig;
  @ViewChild('logoutModal') logoutModal: TemplateRef<any>;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private modalService: NgbModal,
    private socketService: SocketService,
    private authService: AuthService,
  ) {
    this.themeService.logoSubject.pipe(take(1)).subscribe((url) => this.logoUrl = url);
    this.logoutModalConfig = {
      type: 'primary',
      title: 'Log Out from Sound Health',
      body: 'Are you sure you want to leave Sound Health?',
      closeButtonLabel: 'Cancel',
      submitButtonLabel: 'Log Out',
      onSubmit: this.logout.bind(this),
    };

    this.socketService.connect();
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

  openLogoutModal() {
    this.modalService.open(this.logoutModal, { centered: true, size: 'md' })
  }

  logout() {
    this.authService.logout();
    this.modalService.dismissAll()
  }
}
