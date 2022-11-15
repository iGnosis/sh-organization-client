import { Component, OnInit } from '@angular/core';

type Tabs = 'Customization' | 'Billing' | 'Users and Access';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  tabs: Tabs[] = ['Customization', 'Billing', 'Users and Access'];
  currentTab: Tabs = 'Customization';

  constructor() {}

  ngOnInit(): void {}

  setCurrentTab(tabNamme: Tabs) {
    this.currentTab = tabNamme;
  }

  
}
