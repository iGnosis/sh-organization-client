import { Component, Input, OnInit } from '@angular/core';
import { ModalConfig } from 'src/app/pointmotion';

@Component({
  selector: 'primary-modal',
  templateUrl: './primary-modal.component.html',
  styleUrls: ['./primary-modal.component.scss']
})
export class PrimaryModalComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @Input() public modal: any;

  constructor() {
    this.modalConfig = {
      type: 'primary',
      title: '',
      body: '',
      closeButtonLabel: 'Cancel',
      submitButtonLabel: 'Submit',
      onClose: () => {},
      onSubmit: () => {},
    };
  }

  ngOnInit(): void {
  }

}
