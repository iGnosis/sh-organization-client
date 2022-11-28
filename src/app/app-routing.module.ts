import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCareplanComponent } from './components/careplan/create-careplan/create-careplan.component';
import { InviteGuard } from './guards/invite-guard';
import { PrivateGuard } from './guards/private-guard';
import { PublicGuard } from './guards/public-guard';
import { PrivateComponent } from './layouts/private/private.component';
import { PublicComponent } from './layouts/public/public.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './pages/auth/set-password/set-password.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { SmsOtpLoginComponent } from './pages/auth/sms-otp-login/sms-otp-login/sms-otp-login.component';
import { AccountComponent } from './pages/home/account/account.component';
import { ActivitiesDetailsComponent } from './pages/home/activities/activities-details/activities-details';
import { ActivitiesComponent } from './pages/home/activities/activities.component';
import { AddOrganizationComponent } from './pages/home/admin/add-organization/add-organization.component';
import { AdminComponent } from './pages/home/admin/admin.component';
import { AddPatient } from './pages/home/care-plan/add-patient/add-patient-popup.component';
import { CarePlanDetailComponent } from './pages/home/care-plan/care-plan-detail/care-plan-detail.component';
import { CarePlanComponent } from './pages/home/care-plan/care-plan.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { PatientAddComponent } from './pages/home/patients/patient-add/patient-add.component';
import { PatientDetailsComponent } from './pages/home/patients/patient-details/patient-details.component';
import { PatientsComponent } from './pages/home/patients/patients.component';
import { SessionsDetailsComponent } from './pages/home/sessions/session-details/sessions-details.component';
import { AddPatientComponent } from './pages/invite/add-patient/add-patient.component';
import { AddStaffComponent } from './pages/invite/add-staff/add-staff.component';
import { SessionComponent } from './pages/session/session.component';
import { CallbackComponent } from './widgets/fhir/callback/callback.component';


const routes: Routes = [
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },
  { path: 'invite/:inviteCode', canActivate: [InviteGuard], children: [] },
  {
    path: 'public', component: PublicComponent, canActivateChild: [PublicGuard], children: [
      { path: 'auth/sign-in', component: SignInComponent },
      {path:'auth/sms-login', component: SmsOtpLoginComponent},
      { path: 'auth/forgot-password', component: ForgotPasswordComponent },
      { path: 'auth/set-password/:code', component: SetPasswordComponent }
    ]
  },
  {
    path: 'app',
    component: PrivateComponent,
    canActivateChild: [PrivateGuard],
    data: {
      breadcrumb: {
        label: 'Home',
        info: 'Home',
        routeInterceptor: (routeLink: any, breadcrumb: any)=> {
          //console.log(breadcrumb);
          return '/app/dashboard';
        }
      },
    },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          breadcrumb: {
            label: 'Therapist',
            info: 'Therapist',
          }
        },
      },
      { path: "patients", data: { breadcrumb: "Patients" }, component: PatientsComponent },
      { path: 'patients/new', component: PatientAddComponent, data: { breadcrumb: "New Patient" } },
      { path: 'patients/:id/care-plan', component: PatientAddComponent },
      { path: 'patients/:id', component: PatientDetailsComponent, data: { breadcrumb: "Patient" },
        // children: [
        //   {
        //     path: 'session/:id',
        //     data: { breadcrumb: "Session Details" },
        //     component: SessionsDetailsComponent,
        //   },
        // ]
      },

      { path: 'care-plans',
        data: { breadcrumb: "Care Plans" },
        children: [
          {
            path: "new",
            component: CreateCareplanComponent,
            data: { breadcrumb: "Add Care Plan" },
          },
          {
            path: '',
            pathMatch: "full",
            component: CarePlanComponent,
          },
          {
            path: ":id",
            component: CarePlanDetailComponent,
            data: { breadcrumb: "Care Plan Details" },
          },
        ]
      },
      //{ path: 'care-plans/new', component: CreateCareplanComponent },
      { path: 'activities', component: ActivitiesComponent },
      { path: 'activities/:id', component: ActivitiesDetailsComponent },
      // { path: 'sessions', component: SessionsDetailsComponent },
      { path: 'sessions/:id', component: SessionsDetailsComponent, data: { breadcrumb: "Activity" } },

      { path: 'account', component: AccountComponent },
      { path: 'admin', data: { breadcrumb: 'Admin' }, children: [
        { path: '', component:  AdminComponent, pathMatch: 'full' },
        { path: 'add-organization', component:  AddOrganizationComponent, data: { breadcrumb: 'Add Organization' } },
      ]
    },

    ]
  },
  { path: 'session/:id', component: SessionComponent, canActivate: [PrivateGuard]},
  { path: 'fhir', component: CallbackComponent, canActivate: [PrivateGuard] },

  {path:'invite/patient', component: AddPatientComponent},
  {path:'invite/staff', component: AddStaffComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
