import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';

type BillingTab = 'subscriptions' | 'transactions';
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  constructor() { }

  @Input() tab: BillingTab;

  currentTab: BillingTab = 'subscriptions';
  tabs: BillingTab[] = ['subscriptions', 'transactions'];

  ngOnInit(): void {
  }

  setCurrentTab(tab: BillingTab) {
    this.currentTab = tab;
  }



}
