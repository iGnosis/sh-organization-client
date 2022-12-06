import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  constructor(private authService: AuthService) {}

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
    this.authService.rbac(document.querySelectorAll('[data-auth-key]'));

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
