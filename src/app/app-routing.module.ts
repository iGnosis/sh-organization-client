import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PublicComponent } from './layouts/public/public.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';

const routes: Routes = [
  { path: 'public', component: PublicComponent, children: [
    { path: 'auth/sign-in', component: SignInComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
