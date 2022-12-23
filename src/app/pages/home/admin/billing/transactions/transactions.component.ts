import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

type Transaction = {
  createdAt: string;
  billingPeriod: string;
  revenue: string;
  downloadReport: string;
};
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, AfterViewInit {

  @ViewChild('TableOnePaginator', { static: true }) tableOnePaginator: MatPaginator;
  displayedColumns = [
    'createdAt',
    'billingPeriod',
    'revenue',
    'downloadReport',
  ];

  constructor() { }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.tableOnePaginator;
  }



  dataSource = new MatTableDataSource<Transaction>();
  ngOnInit(): void {

    this.dataSource.data = [
      {
        billingPeriod: 'Dec, 2022',
        createdAt: '15 Dec 2022',
        revenue: '900',
        downloadReport: '#'
      },
      {
        billingPeriod: 'Nov, 2022',
        createdAt: '15 Nov 2022',
        revenue: '900',
        downloadReport: '#'
      },
      {
        billingPeriod: 'Oct, 2022',
        createdAt: '15 Oct 2022',
        revenue: '900',
        downloadReport: '#'
      },
      {
        billingPeriod: 'Dec, 2022',
        createdAt: '15 Dec 2022',
        revenue: '900',
        downloadReport: '#'
      },
      {
        billingPeriod: 'Nov, 2022',
        createdAt: '15 Nov 2022',
        revenue: '900',
        downloadReport: '#'
      },
      {
        billingPeriod: 'Oct, 2022',
        createdAt: '15 Oct 2022',
        revenue: '900',
        downloadReport: '#'
      },
      {
        billingPeriod: 'Oct, 2022',
        createdAt: '15 Oct 2022',
        revenue: '900',
        downloadReport: '#'
      },
      {
        billingPeriod: 'Dec, 2022',
        createdAt: '15 Dec 2022',
        revenue: '900',
        downloadReport: '#'
      },
      {
        billingPeriod: 'Nov, 2022',
        createdAt: '15 Nov 2022',
        revenue: '900',
        downloadReport: '#'
      },
      {
        billingPeriod: 'Oct, 2022',
        createdAt: '15 Oct 2022',
        revenue: '900',
        downloadReport: '#'
      }, {
        billingPeriod: 'Oct, 2022',
        createdAt: '15 Oct 2022',
        revenue: '900',
        downloadReport: '#'
      },
      {
        billingPeriod: 'Dec, 2022',
        createdAt: '15 Dec 2022',
        revenue: '900',
        downloadReport: '#'
      },
      {
        billingPeriod: 'Nov, 2022',
        createdAt: '15 Nov 2022',
        revenue: '900',
        downloadReport: '#'
      },
      {
        billingPeriod: 'Oct, 2022',
        createdAt: '15 Oct 2022',
        revenue: '900',
        downloadReport: '#'
      },


    ];
  }

}
