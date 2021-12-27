import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PrivateComponent } from './layouts/private/private.component';
import { PublicComponent } from './layouts/public/public.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { ActivitiesComponent } from './pages/home/activities/activities.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { PatientDetailsComponent } from './pages/home/patient-details/patient-details.component';
import { PatientsComponent } from './pages/home/patients/patients.component';

const routes: Routes = [
  { path: '', redirectTo: 'public/auth/sign-in', pathMatch: 'full'},
  { path: 'public', component: PublicComponent, children: [
    { path: 'auth/sign-in', component: SignInComponent}
  ]},
  { path: 'app', component: PrivateComponent, children: [
    { path: 'dashboard', component: DashboardComponent},
    { path: 'patients', component: PatientsComponent},
    { path: 'patient-details', component: PatientDetailsComponent},
    { path: 'activities', component: ActivitiesComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
