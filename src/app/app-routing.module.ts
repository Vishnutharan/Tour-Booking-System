import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { RegisterComponent } from './Component/register/register.component';
import { HomeComponent } from './Component/home/home.component';
import { BookingComponent } from './Component/booking/booking.component';
import { TravelPackagesComponent } from './Component/travel-packages/travel-packages.component';
import { CountriesListComponent } from './Component/countries-list/countries-list.component';
import { CountryDetailsComponent } from './Component/country-details/country-details.component';
import { PaymentPageComponent } from './Component/payment-page/payment-page.component';
import { BookingConfirmationComponent } from './Component/booking-confirmation/booking-confirmation.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'paymentonline', component: PaymentPageComponent },
  { path: 'tpack', component: TravelPackagesComponent },
  { path: 'country', component: CountriesListComponent },
  { path: 'country/:id', component: CountryDetailsComponent },
  { path: 'booking-confirmation', component: BookingConfirmationComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Optional default route
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
