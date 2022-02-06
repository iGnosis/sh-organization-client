import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PrivateGuard } from './guards/private-guard';
import { PublicGuard } from './guards/public-guard';
import { PrivateComponent } from './layouts/private/private.component';
import { PublicComponent } from './layouts/public/public.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './pages/auth/set-password/set-password.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { ActivitiesComponent } from './pages/home/activities/activities.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { PatientAddComponent } from './pages/home/patient-add/patient-add.component';
import { PatientDetailsComponent } from './pages/home/patient-details/patient-details.component';
import { PatientsComponent } from './pages/home/patients/patients.component';

const routes: Routes = [
  { path: '', redirectTo: 'public/auth/sign-in', pathMatch: 'full'},
  { path: 'public', component: PublicComponent, canActivateChild: [PublicGuard], children: [
    { path: 'auth/sign-in', component: SignInComponent},
    { path: 'auth/forgot-password', component: ForgotPasswordComponent},
    { path: 'auth/set-password', component: SetPasswordComponent}
  ]},
  { path: 'app', component: PrivateComponent, canActivateChild: [PrivateGuard],children: [
    { path: 'dashboard', component: DashboardComponent},
    { path: 'patients', component: PatientsComponent},
    { path: 'patients/new', component: PatientAddComponent},
    { path: 'patients/:id', component: PatientDetailsComponent},
    { path: 'activities', component: ActivitiesComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
