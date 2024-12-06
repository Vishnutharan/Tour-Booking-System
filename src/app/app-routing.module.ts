import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { RegisterComponent } from './Component/register/register.component';
import { HomeComponent } from './Component/home/home.component';
import { BookingComponent } from './Component/booking/booking.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'booking', component:BookingComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Optional default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
