import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivateComponent } from './layouts/private/private.component';
import { PublicComponent } from './layouts/public/public.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { PatientsComponent } from './pages/home/patients/patients.component';
import { PatientDetailsComponent } from './pages/home/patients/patient-details/patient-details.component';

import { ActivitiesComponent } from './pages/home/activities/activities.component';
import { ActivitiesDetailsComponent } from './pages/home/activities/activities-details/activities-details';
import { NgChartsModule } from 'ng2-charts';
import { ActivePatientsComponent } from './widgets/dashboard/active-patients/active-patients.component';
import { InvitePatientComponent } from './widgets/modal/invite-patient/invite-patient.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './pages/auth/set-password/set-password.component';
import { PatientAddComponent } from './pages/home/patients/patient-add/patient-add.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PrivateGuard } from './guards/private-guard';
import { PublicGuard } from './guards/public-guard';
import { CreateCareplanComponent } from './components/careplan/create-careplan/create-careplan.component';
import { CarePlanComponent } from './pages/home/care-plan/care-plan.component';
import { CareplansListComponent } from './components/careplan/careplans-list/careplans-list.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { SessionsDetailsComponent } from './pages/home/sessions/session-details/sessions-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableFilterModule } from 'mat-table-filter';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { MatDialogModule } from '@angular/material/dialog';
import { AvatarComponent } from './widgets/avatar/avatar.component';
import { PatientsListComponent } from './pages/home/patients/patients-list/patients-list.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CarePlanDetailComponent } from './pages/home/care-plan/care-plan-detail/care-plan-detail.component';
import { StartSessionPopUp } from './pages/home/patients/start-session/start-session-popup.component';
import { SessionComponent } from './pages/session/session.component';
import { SafePipe } from './pipes/safe/safe.pipe';
import { AddCareplan } from './pages/home/patients/add-careplan/add-careplan-popup.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AddPatient } from './pages/home/care-plan/add-patient/add-patient-popup.component';
import { AccountComponent } from './pages/home/account/account.component';
import { CallbackComponent } from './widgets/fhir/callback/callback.component';
import { SmsOtpLoginComponent } from './pages/auth/sms-otp-login/sms-otp-login/sms-otp-login.component';
import { PatientsHeatmapComponent } from './pages/home/patients/patients-heatmap/patients-heatmap.component';
import { AdminComponent } from './pages/home/admin/admin.component';
import { CustomizationComponent } from './pages/home/admin/customization/customization.component';
import { BillingComponent } from './pages/home/admin/billing/billing.component';
import { UsersAccessComponent } from './pages/home/admin/users-access/users-access.component';
import {
  MatColorFormats,
  MAT_COLOR_FORMATS,
  NgxMatColorPickerModule,
  NGX_MAT_COLOR_FORMATS,
} from '@angular-material-components/color-picker';
import { LatestSessionsComponent } from './pages/home/patients/latest-sessions/latest-sessions.component';
import { RelativeTimePipe } from './pipes/relative-time/relative-time.pipe';
import { HexToColorPipe } from './pipes/hex-to-color/hex-to-color.pipe';
import { AddOrganizationComponent } from './pages/home/admin/add-organization/add-organization.component';
import { InviteGuard } from './guards/invite-guard';
import { AddPatientComponent } from './pages/invite/add-patient/add-patient.component';
import { AddStaffComponent } from './pages/invite/add-staff/add-staff.component';
import { ArchiveMemberModalComponent } from './components/archive-member-modal/archive-member-modal.component';
import { UserDetailsComponent } from './pages/home/admin/user-details/user-details.component';
import { InvitePatientModalComponent } from './components/invite-patient-modal/invite-patient-modal.component';
import { AddPatientModalComponent } from './components/add-patient-modal/add-patient-modal.component';
import { AccessControlDirective } from './guards/access-control.directive';
import { PrimaryModalComponent } from './components/primary-modal/primary-modal.component';
import { TimeagoModule } from 'ngx-timeago';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
// import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// };

@NgModule({
  declarations: [
    AppComponent,
    PrivateComponent,
    PublicComponent,
    SignInComponent,
    DashboardComponent,
    PatientsComponent,
    PatientDetailsComponent,
    ActivitiesComponent,
    ActivitiesDetailsComponent,
    ActivePatientsComponent,
    InvitePatientComponent,
    ForgotPasswordComponent,
    SetPasswordComponent,
    PatientAddComponent,
    CreateCareplanComponent,
    CarePlanComponent,
    CareplansListComponent,
    ToastsComponent,
    SessionsDetailsComponent,
    AvatarComponent,
    PatientsListComponent,
    CarePlanDetailComponent,
    StartSessionPopUp,
    AddCareplan,
    SessionComponent,
    SafePipe,
    AddPatient,
    AccountComponent,
    CallbackComponent,
    SmsOtpLoginComponent,
    PatientsHeatmapComponent,
    AdminComponent,
    CustomizationComponent,
    BillingComponent,
    UsersAccessComponent,
    LatestSessionsComponent,
    RelativeTimePipe,
    HexToColorPipe,
    AddOrganizationComponent,
    AddPatientComponent,
    AddStaffComponent,
    ArchiveMemberModalComponent,
    UserDetailsComponent,
    InvitePatientModalComponent,
    AddPatientModalComponent,
    AccessControlDirective,
    PrimaryModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    NgxPaginationModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatTableFilterModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    BreadcrumbModule,
    MatDialogModule,
    CarouselModule,
    Ng2SearchPipeModule,
    NgxMatColorPickerModule,
    TimeagoModule.forRoot(),
    // PerfectScrollbarModule
  ],
  providers: [
    PrivateGuard,
    PublicGuard,
    InviteGuard,
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },

    // {
    //   provide: PERFECT_SCROLLBAR_CONFIG,
    //   useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    // }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
