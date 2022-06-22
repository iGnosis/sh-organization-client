import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-session-play',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  url = ''
  sessionId = ''
  @ViewChild('session') session!: ElementRef<HTMLIFrameElement>;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.sessionId = this.route.snapshot.paramMap.get('id') as string;
    this.url = environment.activityEndpoint + '?session='+this.sessionId
  }

  ngOnInit(): void {
    setTimeout(() => {
      // TODO: Bad security practice, need a better way to do it...
      this.session.nativeElement.contentWindow?.postMessage({
        token: window.localStorage.getItem('token'),
        session: this.sessionId,
        type: 'token'
      }, '*')
    }, 1000);
    
    window.addEventListener("message", (event) => {
      if(event && event.data && event.data.session && event.data.session.id) {
        this.router.navigate(['/app/sessions', event.data.session.id])
      }
    }, false);
    
  }

}
