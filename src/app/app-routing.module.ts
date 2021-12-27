import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './layouts/public/public.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';

const routes: Routes = [
  { path: '', redirectTo: 'public/auth/sign-in', pathMatch: 'full'},
  { path: 'public', component: PublicComponent, children: [
    { path: 'auth/sign-in', component: SignInComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
