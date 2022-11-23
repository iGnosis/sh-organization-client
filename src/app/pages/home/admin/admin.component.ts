import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Tabs } from 'src/app/pointmotion';
import { CustomizationComponent } from './customization/customization.component';
import { UsersAccessComponent } from './users-access/users-access.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  @ViewChild(CustomizationComponent)
  private customizationComponent: CustomizationComponent;

  @ViewChild(UsersAccessComponent) usersAccessComponent: UsersAccessComponent;

  tabs: Tabs[] = ['Customization', 'Billing', 'Users and Access'];
  currentTab: Tabs = 'Customization';
  customizable = false;
  changesInCustomizationTab = true;

  constructor() {}

  ngOnInit(): void {}

  setCurrentTab(tabName: Tabs) {
    this.currentTab = tabName;
  }

  setCustomizable() {
    this.customizable = !this.customizable;
  }

  handleChangeEvent(data: boolean) {
    this.changesInCustomizationTab = data;
  }

  saveCustomization() {
    this.customizable = false;
    this.customizationComponent.saveChanges();
  }

  openAddMemberModal() {
    this.usersAccessComponent.openAddMemberModal(
      this.usersAccessComponent.addMemberModal
    );
  }
}
