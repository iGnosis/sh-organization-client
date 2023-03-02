import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  constructor(
    private gqlService: GraphqlService,
    private userService: UserService
  ) {}

  isEditable = false;
  changesMade = false;
  subscriptionPlan!: {
    subscriptionFee: number;
    trialPeriod: number;
    requirePaymentDetails: boolean;
  };

  ngOnInit(): void {
    this.initValues();
  }

  async initValues() {
    const organizationId = this.userService.get().orgId;
    const resp = await this.gqlService.gqlRequest(
      GqlConstants.GET_SUBCRIPTION_PLAN,
      {
        organizationId,
      },
      true
    );
    this.subscriptionPlan = resp.subscription_plans[0];
  }
  saveSubscriptionPlanChanges() {}
}
