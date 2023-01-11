import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../../../../services/jwt/jwt.service';

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

  constructor(private jwtService: JwtService, private http: HttpClient) { }
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

  async downloadReport(billingPeriod: string) {
    try {
      const billingDate = new Date(billingPeriod);
      const startOfMonth = new Date(billingDate.getFullYear(), billingDate.getMonth(), 1);
      const endOfMonth = new Date(billingDate.getFullYear(), billingDate.getMonth() + 1, 0);

      const token = this.jwtService.getToken();
      const headers = {
        responseType: 'arraybuffer',
        Authorization: `Bearer ${token}`,
      };
      const url = `${environment.servicesEndpoint}/organization-payment/report`;
      
      const report = await firstValueFrom(this.http.post(url, {
        startDate: startOfMonth,
        endDate: endOfMonth,
      }, {
        headers,
        responseType: 'blob',
      }));
      if (!report) return;
      const downloadUrl = window.URL.createObjectURL(report);
  
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'financial-report.txt');
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

}
