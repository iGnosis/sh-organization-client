import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsOtpLoginComponent } from './sms-otp-login.component';

describe('SmsOtpLoginComponent', () => {
  let component: SmsOtpLoginComponent;
  let fixture: ComponentFixture<SmsOtpLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsOtpLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsOtpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
