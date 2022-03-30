import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CreateCareplanComponent } from './components/careplan/create-careplan/create-careplan.component';
import { PrivateGuard } from './guards/private-guard';
import { PublicGuard } from './guards/public-guard';
import { PrivateComponent } from './layouts/private/private.component';
import { PublicComponent } from './layouts/public/public.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './pages/auth/set-password/set-password.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { ActivitiesComponent } from './pages/home/activities/activities.component';
import { CarePlanComponent } from './pages/home/care-plan/care-plan.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { PatientAddComponent } from './pages/home/patients/patient-add/patient-add.component';
import { PatientDetailsComponent } from './pages/home/patients/patient-details/patient-details.component';
import { PatientsComponent } from './pages/home/patients/patients.component';
import { SessionsDetailsComponent } from './pages/home/patients/sessions/sessions-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'public/auth/sign-in', pathMatch: 'full'},
  { path: 'public', component: PublicComponent, canActivateChild: [PublicGuard], children: [
    { path: 'auth/sign-in', component: SignInComponent},
    { path: 'auth/forgot-password', component: ForgotPasswordComponent},
    { path: 'auth/set-password/:code', component: SetPasswordComponent}
  ]},
  { path: 'app', component: PrivateComponent, canActivateChild: [PrivateGuard],children: [
    { path: 'dashboard', component: DashboardComponent},
    { path: 'patients', component: PatientsComponent},
    { path: 'patients/new', component: PatientAddComponent},
    { path: 'patients/:id/care-plan', component: PatientAddComponent},
    { path: 'patients/:id', component: PatientDetailsComponent},
    { path: 'care-plans', component: CarePlanComponent},
    { path: 'care-plans/new', component: CreateCareplanComponent},
    { path: 'activities', component: ActivitiesComponent},
    { path: 'sessions', component: SessionsDetailsComponent},
    { path: 'sessions/:id', component: SessionsDetailsComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
