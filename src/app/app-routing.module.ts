import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { RegisterComponent } from './Component/register/register.component';
import { HomeComponent } from './Component/home/home.component';
import { TravelPackagesComponent } from './Component/travel-packages/travel-packages.component';
import { CountriesListComponent } from './Component/countries-list/countries-list.component';
import { PaymentPageComponent } from './Component/payment-page/payment-page.component';
import { BookingConfirmationComponent } from './Component/booking-confirmation/booking-confirmation.component';
import { BookingFormComponent } from './Component/booking-form/booking-form.component';
import { BookingListComponent } from './Component/booking-list/booking-list.component';
import { BookingDetailsComponent } from './Component/booking-details/booking-details.component';
import { AuthGuard } from './Guard/AuthGuard';
import { FinalAddtoCartComponent } from './Component/final-addto-cart/final-addto-cart.component';
import { CountryAddtocartComponent } from './Component/country-addtocart/country-addtocart.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'paymentonline', component: PaymentPageComponent },
  { path: 'tpack', component: TravelPackagesComponent },
  { path: 'country', component: CountriesListComponent },
  { path: 'country/:id', component: CountryAddtocartComponent },
  { path: 'booking-confirmation', component: BookingConfirmationComponent },
  { path: 'final-cart',component:FinalAddtoCartComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Optional default route
  { path: 'booking-form', component: BookingFormComponent, canActivate: [AuthGuard]},
  { path: 'booking-list', component: BookingListComponent, canActivate:[AuthGuard]},
  { path: 'booking-details/:id', component: BookingDetailsComponent, canActivate: [AuthGuard]}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
