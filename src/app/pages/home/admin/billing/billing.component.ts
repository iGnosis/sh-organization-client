import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  constructor() {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<{
    createdAt: string;
    billingPeriod: string;
    revenue: string;
    downloadReportId: string;
  }>;

  displayedColumns = [
    'createdAt',
    'billingPeriod',
    'revenue',
    'downloadReport',
  ];

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([
      {
        billingPeriod: '2021-01-01',
        createdAt: '2021-02-01',
        revenue: '$100',
        downloadReportId: '123',
      },
      {
        billingPeriod: '2021-01-01',

        createdAt: '2021-02-01',
        revenue: '$100',
        downloadReportId: '123',
      },
      {
        billingPeriod: '2021-01-01',
        createdAt: '2021-02-01',
        revenue: '$100',
        downloadReportId: '123',
      },
      {
        billingPeriod: '2021-01-01',

        createdAt: '2021-02-01',
        revenue: '$100',
        downloadReportId: '123',
      },
    ]);
  }
}
