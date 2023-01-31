import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support-fab',
  templateUrl: './support-fab.component.html',
  styleUrls: ['./support-fab.component.scss'],
})
export class SupportFabComponent implements OnInit {
  fab = false;
  constructor() {}

  ngOnInit(): void {}

  toggleFab() {
    this.fab = !this.fab;
  }
}
