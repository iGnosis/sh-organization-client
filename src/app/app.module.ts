import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

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
    ActivePatientsComponent,
    InvitePatientComponent,
    ForgotPasswordComponent,
    SetPasswordComponent,
    PatientAddComponent,
    CreateCareplanComponent,
    CarePlanComponent,
    CareplansListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    PrivateGuard,
    PublicGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
