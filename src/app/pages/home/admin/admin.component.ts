import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Tabs } from 'src/app/pointmotion';
import { BreadcrumbService } from 'xng-breadcrumb';
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

  tabs: Tabs[] = ['Users and Access', 'Billing', 'Customization'];
  currentTab: Tabs = 'Users and Access';
  customizable = false;
  changesInCustomizationTab = true;

  billingTabs: ('subscriptions' | 'transactions')[] = ['subscriptions', 'transactions'];
  currentBillingTab: 'subscriptions' | 'transactions' = 'subscriptions';
  constructor(private breadCrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.breadCrumbService.set('/app/admin', this.currentTab);
   }

  setCurrentTab(tabName: Tabs) {
    this.currentTab = tabName;
    console.log('set::tab::', tabName);
    this.breadCrumbService.set('/app/admin', tabName);
  }

  setCustomizable() {
    this.customizable = !this.customizable;
  }

  setCurrentBillingTab(tab: 'subscriptions' | 'transactions') {
    this.currentBillingTab = tab;
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
