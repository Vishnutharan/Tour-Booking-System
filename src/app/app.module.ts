import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './Component/login/login.component';
import { RegisterComponent } from './Component/register/register.component';
import { HomeComponent } from './Component/home/home.component';
import { BookingComponent } from './Component/booking/booking.component';
import { TravelPackagesComponent } from './Component/travel-packages/travel-packages.component';
import { CountriesListComponent } from './Component/countries-list/countries-list.component';
import { LucideAngularModule, Globe, Plane, Star } from 'lucide-angular';
import { CountryDetailsComponent } from './Component/country-details/country-details.component';
import { PaymentPageComponent } from './Component/payment-page/payment-page.component';
import { BookingConfirmationComponent } from './Component/booking-confirmation/booking-confirmation.component';
import { ConfirmBookingComponent } from './Component/confirm-booking/confirm-booking.component';
import { TamilComponent } from './Component/Language/tamil/tamil.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    BookingComponent,
    LoginComponent,
    TravelPackagesComponent,
    CountriesListComponent,
    CountryDetailsComponent,
    PaymentPageComponent,
    BookingConfirmationComponent,
    ConfirmBookingComponent,
    TamilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    LucideAngularModule.pick({ Globe, Plane, Star })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }