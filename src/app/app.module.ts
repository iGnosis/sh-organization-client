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

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

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
    SessionsDetailsComponent
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
    MatSortModule
  ],
  providers: [
    PrivateGuard,
    PublicGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
