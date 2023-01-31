import { Component } from '@angular/core';
import { phone } from 'phone';
// import countryCodes from 'country-codes-list'
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt/jwt.service';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { UserRole } from 'src/app/users.enum';

// TODO: Decouple this Component (checkins, onboardings... etc)
@Component({
  selector: 'app-sms-otp-login',
  templateUrl: './sms-otp-login.component.html',
  styleUrls: ['./sms-otp-login.component.scss'],
})
export class SmsOtpLoginComponent {
  environment = environment;
  UserRole = UserRole;

  shScreen = false;
  isMusicEnded = false;
  step = 0;
  selectedCountry = '+1 USA'; // set default to USA
  countryCode = '+1'; // set default to USA
  phoneNumber?: string;
  otpCode?: string;
  formErrorMsg?: string;
  // countryCodesList?: { [key: number]: string };

  // required to figure out which OTP API to call.
  // The Resend OTP API is called if numbers haven't changed.
  tempFullPhoneNumber?: string;
  fullPhoneNumber?: string;
  showResendOtpTimerText = false;
  resendOtpTimer = 59;
  inviteCode?: string;

  mockLoginUserRole: UserRole;

  throttledSubmit: (...args: any[]) => void;
  throttledResend: (...args: any[]) => void;
  constructor(
    private graphQlService: GraphqlService,
    private router: Router,
    private jwtService: JwtService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.inviteCode = this.route.snapshot.paramMap.get('inviteCode') || '';
    this.throttledSubmit = this.throttle((event: any) => {
      this.submit(event);
    }, 500);
    this.throttledResend = this.throttle(() => {
      this.resendOTP();
    }, 1000);
  }

  ngOnInit(): void { }


  throttle(fn: any, wait = 500) {
    let isCalled = false;
    return function (...args: any[]) {
      if (!isCalled) {
        fn(...args);
        isCalled = true;
        setTimeout(function () {
          isCalled = false;
        }, wait);
      }
    };
  }


  async submit(event: any) {
    // call API to send an OTP
    if (this.step === 0) {
      this.countryCode = event.target.countryCode.value;
      if (this.countryCode.slice(0, 1) !== '+') {
        this.countryCode = `+${this.countryCode}`;
      }
      this.phoneNumber = event.target.phoneNumber.value;

      this.countryCode = this.countryCode ? this.countryCode.trim() : '';
      this.phoneNumber = this.phoneNumber ? this.phoneNumber.trim() : '';
      console.log('submit:countryCode:', this.countryCode);
      console.log('submit:phoneNumber:', this.phoneNumber);

      const phoneObj = phone(`${this.countryCode}${this.phoneNumber}`);
      console.log(phoneObj);

      if (!phoneObj.isValid) {
        this.formErrorMsg = ('Phone number is not valid');
        return;
      }

      this.fullPhoneNumber = phoneObj.phoneNumber;

      // call the Resend OTP API, since phone number did not change.
      if (this.tempFullPhoneNumber === this.fullPhoneNumber) {
        console.log('resend OTP API called');
        const resp = await this.graphQlService.gqlRequest(
          GqlConstants.RESEND_LOGIN_OTP,
          {
            phoneCountryCode: this.countryCode,
            phoneNumber: this.phoneNumber,
          },
          false
        );

        if (resp.toString().toLowerCase().includes('unauthorized')) {
          this.showError(
            'You do not have permission to access this page. Please contact your administrator if you think this is a mistake.'
          );
          return;
        } else if (
          !resp ||
          !resp.resendLoginOtp ||
          !resp.resendLoginOtp.data.message
        ) {
          this.showError('Something went wrong while sending OTP.');
          return;
        }

        // increment step
        this.formErrorMsg = '';
        this.step++;
      }
      // call Request Login OTP API, since the phone number changed.
      else {
        const resp = await this.graphQlService.gqlRequest(
          GqlConstants.REQUEST_LOGIN_OTP,
          {
            phoneCountryCode: this.countryCode,
            phoneNumber: this.phoneNumber,
            inviteCode: this.inviteCode,
          },
          false
        );
        if (resp.toString().toLowerCase().includes('unauthorized')) {
          this.showError(
            'You do not have permission to access this page. Please contact your administrator if you think this is a mistake.'
          );
          return;
        } else if (
          !resp ||
          !resp.requestLoginOtp ||
          !resp.requestLoginOtp.data.message
        ) {
          this.showError('Something went wrong while sending OTP.');
          return;
        }
        // increment step
        this.formErrorMsg = '';
        this.step++;
      }

      this.showResendOtpTimerText = true;
      this.resendOtpTimer = 60;
      const timerInt = setInterval(() => {
        this.resendOtpTimer--;
        if (this.resendOtpTimer === 0) {
          clearInterval(timerInt);
          this.showResendOtpTimerText = false;
        }
      }, 1000);
    }

    // call API to validate the code
    else if (this.step === 1) {
      this.otpCode = event.target.otpCode.value;
      console.log('submit:otpCode:', this.otpCode);

      // you should get back JWT in success response.
      const resp = await this.graphQlService.gqlRequest(
        GqlConstants.VERIFY_LOGIN_OTP,
        {
          phoneCountryCode: this.countryCode,
          phoneNumber: this.phoneNumber,
          otp: parseInt(this.otpCode!),
        },
        false
      );

      if (!resp || !resp.verifyLoginOtp || !resp.verifyLoginOtp.data.token) {
        this.showError('That is not the code.');
        return;
      }

      // set user as well
      this.jwtService.setToken(resp.verifyLoginOtp.data.token);

      const accessTokenData = this.decodeJwt(resp.verifyLoginOtp.data.token);
      const userId =
        accessTokenData['https://hasura.io/jwt/claims']['x-hasura-user-id'];

      const userRole: UserRole =
        accessTokenData['https://hasura.io/jwt/claims'][
        'x-hasura-default-role'
        ];
      const orgId =
        accessTokenData['https://hasura.io/jwt/claims'][
          'x-hasura-organization-id'
        ];

      this.userService.set({
        id: userId,
        type: userRole,
        orgId: orgId,
      });
      console.log('user set successfully');

      await this.authService.initRbac();

      if (this.inviteCode) {
        this.router.navigate(['/app/admin/add-organization']);
      } else {
        const defaultRoute = UserService.getDefaultRoute(userRole);
        this.router.navigate([defaultRoute]);
      }
    }


  }

  resetForm() {
    this.tempFullPhoneNumber = this.fullPhoneNumber;
    this.step = 0;
    this.phoneNumber = '';
    this.fullPhoneNumber = '';
    this.otpCode = '';
    this.formErrorMsg = '';
  }

  showError(message: string, timeout = 5000) {
    this.formErrorMsg = message;
    setTimeout(() => {
      this.formErrorMsg = '';
    }, timeout);
  }


  setUserRole(userRole: UserRole) {
    this.mockLoginUserRole = userRole;
  }

  async mockLogin() {
    if (!this.mockLoginUserRole) {
      this.showError('No User Role Selected.');
      return;
    }

    const userRole = this.mockLoginUserRole;
    console.log('mock login:', userRole);

    const resp = await this.graphQlService.gqlRequest(
      GqlConstants.MOCK_LOGIN,
      { userRole },
      false
    );
    console.log(resp);
    const token = resp.mockStaffJwt.data.jwt;

    this.jwtService.setToken(token);
    const accessTokenData = this.decodeJwt(token);
    const userId =
      accessTokenData['https://hasura.io/jwt/claims']['x-hasura-user-id'];
    const orgId =
      accessTokenData['https://hasura.io/jwt/claims'][
      'x-hasura-organization-id'
      ];
    this.userService.set({
      id: userId,
      type: userRole,
      orgId: orgId,
    });
    console.log('user set successfully');
    const route = UserService.getDefaultRoute(userRole as UserRole);
    this.router.navigate([route]);
  }

  decodeJwt(token: string | undefined) {
    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        return JSON.parse(atob(parts[1]));
      }
    }
  }

  async resendOTP() {
    const resp = await this.graphQlService.gqlRequest(
      GqlConstants.RESEND_LOGIN_OTP,
      {
        phoneCountryCode: this.countryCode,
        phoneNumber: this.phoneNumber,
      },
      false
    );
    this.showResendOtpTimerText = true;
    this.resendOtpTimer = 60;
    const timerInt = setInterval(() => {
      this.resendOtpTimer--;
      if (this.resendOtpTimer === 0) {
        clearInterval(timerInt);
        this.showResendOtpTimerText = false;
      }
    }, 1000);
  }

  async waitForTimeout(timeout: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({});
      }, timeout);
    });
  }

}
