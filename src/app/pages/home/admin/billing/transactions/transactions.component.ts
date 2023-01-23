import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { UserService } from 'src/app/services/user/user.service';
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
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild('TableOnePaginator', { static: true })
  tableOnePaginator: MatPaginator;
  displayedColumns = [
    'createdAt',
    'billingPeriod',
    'revenue',
    'downloadReport',
  ];

  constructor(
    private jwtService: JwtService,
    private http: HttpClient,
    private gqlService: GraphqlService,
    private userService: UserService
  ) {}
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.tableOnePaginator;
  }

  dataSource = new MatTableDataSource<any>();
  async ngOnInit() {
    const resp = await this.gqlService.gqlRequest(
      GqlConstants.GET_BILLING_HISTORY,
      {
        organization: this.userService.get().orgId,
      },
      true
    );

    const billing_history: {
      createdAt: string;
      id: string;
      revenue: number;
      billingPeriod: string;
    }[] = resp.billing_history;

    if (billing_history) {
      const res = billing_history.map((ele) => {
        const billingPeriodDate = new Date(
          new Date(ele.createdAt).getTime() - 1000 * 60 * 60 * 24 - 1
        ).toISOString();

        const month = new Date(billingPeriodDate).toLocaleDateString(
          'default',
          {
            month: 'long',
          }
        );

        ele['billingPeriod'] = `${month} ${new Date(
          billingPeriodDate
        ).getFullYear()}`;

        return ele;
      });

      this.dataSource.data = res;
    }
  }

  getDateStr(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getDate()} ${date.toLocaleDateString('default', {
      month: 'long',
    })}, ${date.getFullYear()}`;
  }

  async downloadReport(billingPeriod: string) {
    try {
      const billingDate = new Date(billingPeriod);
      const startOfMonth = new Date(
        billingDate.getFullYear(),
        billingDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        billingDate.getFullYear(),
        billingDate.getMonth() + 1,
        0
      );

      const token = this.jwtService.getToken();
      const headers = {
        responseType: 'arraybuffer',
        Authorization: `Bearer ${token}`,
      };
      const url = `${environment.servicesEndpoint}/organization-payment/report`;

      const report = await firstValueFrom(
        this.http.post(
          url,
          {
            startDate: startOfMonth,
            endDate: endOfMonth,
          },
          {
            headers,
            responseType: 'blob',
          }
        )
      );
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
