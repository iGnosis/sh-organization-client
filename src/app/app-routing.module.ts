import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCareplanComponent } from './components/careplan/create-careplan/create-careplan.component';
import { PrivateGuard } from './guards/private-guard';
import { PublicGuard } from './guards/public-guard';
import { PrivateComponent } from './layouts/private/private.component';
import { PublicComponent } from './layouts/public/public.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './pages/auth/set-password/set-password.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { ActivitiesDetailsComponent } from './pages/home/activities/activities-details/activities-details';
import { ActivitiesComponent } from './pages/home/activities/activities.component';
import { CarePlanDetailComponent } from './pages/home/care-plan/care-plan-detail/care-plan-detail.component';
import { CarePlanComponent } from './pages/home/care-plan/care-plan.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { PatientAddComponent } from './pages/home/patients/patient-add/patient-add.component';
import { PatientDetailsComponent } from './pages/home/patients/patient-details/patient-details.component';
import { PatientsComponent } from './pages/home/patients/patients.component';
import { SessionsDetailsComponent } from './pages/home/sessions/session-details/sessions-details.component';
import { SessionComponent } from './pages/session/session.component';


const routes: Routes = [
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },
  {
    path: 'public', component: PublicComponent, canActivateChild: [PublicGuard], children: [
      { path: 'auth/sign-in', component: SignInComponent },
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
        data: { breadcrumb: {skip: true} },
      },
      {
        path: "patients",
        canActivateChild: [PrivateGuard],
        data: { breadcrumb: "Patient List" },
        // outlet:'details',
        children: [
          {
            path: "new",
            component: PatientAddComponent,
            data: { breadcrumb: "Patient Add" },
          },
          {
            path: ":id",
            component: PatientDetailsComponent,
            data: { breadcrumb: "Patient Details" },
          },
          {
            path: '',
            pathMatch: "full",
            component: PatientsComponent,
            data: { breadcrumb: "Patients" },
          },
        ],
      },
      //{ path: 'patients/new', component: PatientAddComponent },
      { path: 'patients/:id/care-plan', component: PatientAddComponent },
      //{ path: 'patients/:id', component: PatientDetailsComponent },
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
      { path: 'sessions', component: SessionsDetailsComponent },
      { path: 'sessions/:id', component: SessionsDetailsComponent },

    ]
  },
  { path: 'session/:id', component: SessionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
