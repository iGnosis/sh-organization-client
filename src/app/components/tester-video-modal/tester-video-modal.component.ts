import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';

@Component({
  selector: 'app-tester-video-modal',
  templateUrl: './tester-video-modal.component.html',
  styleUrls: ['./tester-video-modal.component.scss'],
})
export class TesterVideoModalComponent implements OnInit, AfterViewInit {
  constructor(
    public activeModal: NgbActiveModal,
    private gqlService: GraphqlService
  ) {}

  async ngAfterViewInit() {
    const videoElement = this.video.nativeElement;
    console.log('recordingId: ', this.recordingId);

    const resp: {
      viewTesterRecording: {
        data: {
          videoUrl: string;
          configUrl: string;
        };
      };
    } = await this.gqlService.gqlRequest(
      GqlConstants.VIEW_TESTING_VIDEOS,
      {
        recordingId: this.recordingId,
      },
      true
    );
    const { videoUrl } = resp.viewTesterRecording.data;

    videoElement.style.width = '768px';
    videoElement.style.height = '432px';


    videoElement.src = videoUrl;
    videoElement.autoplay = true;
    videoElement.muted = false;
    videoElement.controls = true;
  }

  @ViewChild('videoElm') video!: ElementRef<HTMLVideoElement>;
  @Input() recordingId: string;

  ngOnInit(): void {}
}
