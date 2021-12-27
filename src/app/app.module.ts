import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivateComponent } from './layouts/private/private.component';
import { PublicComponent } from './layouts/public/public.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { PatientsComponent } from './pages/home/patients/patients.component';
import { PatientDetailsComponent } from './pages/home/patient-details/patient-details.component';
import { ActivitiesComponent } from './pages/home/activities/activities.component';

@NgModule({
  declarations: [
    AppComponent,
    PrivateComponent,
    PublicComponent,
    SignInComponent,
    DashboardComponent,
    PatientsComponent,
    PatientDetailsComponent,
    ActivitiesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
