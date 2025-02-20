import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { RegisterComponent } from './Component/register/register.component';
import { HomeComponent } from './Component/home/home.component';
import { TravelPackagesComponent } from './Component/travel-packages/travel-packages.component';
import { CountriesListComponent } from './Component/countries-list/countries-list.component';
import { PaymentPageComponent } from './Component/payment-page/payment-page.component';
import { BookingConfirmationComponent } from './Component/booking-confirmation/booking-confirmation.component';
import { AuthGuard } from './Guard/AuthGuard';
import { FinalAddtoCartComponent } from './Component/final-addto-cart/final-addto-cart.component';
import { CountryAddtocartComponent } from './Component/country-addtocart/country-addtocart.component';
import { TamilComponent } from './Component/Language/tamil/tamil.component';
import { SinhalaComponent } from './Component/Language/sinhala/sinhala.component';
import { HindiComponent } from './Component/Language/hindi/hindi.component';
import { ChinesComponent } from './Component/Language/chines/chines.component';
import { CurrencyConverterComponent } from './Component/currency-converter/currency-converter.component';
import { AdminComponent } from './Component/admin/admin.component';
import { RecomdationComponent } from './Component/recomdation/recomdation.component';
import { CountryDetailsComponent } from './Component/country-details/country-details.component';
import { TouristPlaceComponent } from './Component/tourist-place/tourist-place.component';
import { AdminLoginComponent } from './Component/admin-login/admin-login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'paymentonline', component: PaymentPageComponent },
  { path: 'tpack', component: TravelPackagesComponent },
  { path: 'country', component: CountriesListComponent },
  { path: 'country/:id', component: CountryAddtocartComponent },
  { path: 'booking-confirmation', component: BookingConfirmationComponent },
  { path: 'final-cart', component: FinalAddtoCartComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'Tamil', component: TamilComponent },
  { path: 'Sinhala', component: SinhalaComponent },
  { path: 'Hindi', component: HindiComponent },
  { path: 'Chinese', component: ChinesComponent },
  { path: 'currency', component: CurrencyConverterComponent },
  { path: 'Admin', component: AdminComponent },
  { path: 'recommendation', component: RecomdationComponent },
  { path: 'countrydetails', component: CountryDetailsComponent },
  { path: 'Touristplace', component: TouristPlaceComponent },
  { path: 'Adminlogin', component: AdminLoginComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
