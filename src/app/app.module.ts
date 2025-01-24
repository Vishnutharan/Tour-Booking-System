import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './Component/login/login.component';
import { RegisterComponent } from './Component/register/register.component';
import { HomeComponent } from './Component/home/home.component';
import { TravelPackagesComponent } from './Component/travel-packages/travel-packages.component';
import { LucideAngularModule, Globe, Plane, Star } from 'lucide-angular';
import { PaymentPageComponent } from './Component/payment-page/payment-page.component';
import { BookingConfirmationComponent } from './Component/booking-confirmation/booking-confirmation.component';
import { TamilComponent } from './Component/Language/tamil/tamil.component';
import { BookingFormComponent } from './Component/booking-form/booking-form.component';
import { BookingListComponent } from './Component/booking-list/booking-list.component';
import { BookingDetailsComponent } from './Component/booking-details/booking-details.component';
import { FinalAddtoCartComponent } from './Component/final-addto-cart/final-addto-cart.component';
import { CountryAddtocartComponent } from './Component/country-addtocart/country-addtocart.component';
import { CountriesListComponent } from './Component/countries-list/countries-list.component';
import { SinhalaComponent } from './Component/Language/sinhala/sinhala.component';
import { HindiComponent } from './Component/Language/hindi/hindi.component';
import { ChinesComponent } from './Component/Language/chines/chines.component';
import { AuthInterceptor } from './Interceptor/AuthInterceptor';
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    TravelPackagesComponent,
    PaymentPageComponent,
    BookingConfirmationComponent,
    TamilComponent,
    BookingFormComponent,
    BookingListComponent,
    BookingDetailsComponent,
    FinalAddtoCartComponent,
    CountryAddtocartComponent,
    CountriesListComponent,
    SinhalaComponent,
    HindiComponent,
    ChinesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    LucideAngularModule.pick({ Globe, Plane, Star }),
  ],
  providers: [    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
