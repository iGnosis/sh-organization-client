import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users-access',
  templateUrl: './users-access.component.html',
  styleUrls: ['./users-access.component.scss'],
})
export class UsersAccessComponent implements OnInit {
  @ViewChild('addMemberModal') addMemberModal: TemplateRef<any>;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  openAddMemberModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'sm' });
  }
}
