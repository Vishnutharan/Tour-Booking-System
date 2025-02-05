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
import { FinalAddtoCartComponent } from './Component/final-addto-cart/final-addto-cart.component';
import { CountryAddtocartComponent } from './Component/country-addtocart/country-addtocart.component';
import { CountriesListComponent } from './Component/countries-list/countries-list.component';
import { SinhalaComponent } from './Component/Language/sinhala/sinhala.component';
import { HindiComponent } from './Component/Language/hindi/hindi.component';
import { ChinesComponent } from './Component/Language/chines/chines.component';
import { AuthInterceptor } from './Interceptor/AuthInterceptor';
import { CurrencyConverterComponent } from './Component/currency-converter/currency-converter.component';
import { CurrencyConverterService } from './Service/CurrencyConService';
import { AuthService } from './Service/AuthService';
import { BookingService } from './Service/BookingService';
import { PaymentService } from './Service/payment.service';
import { TravelService } from './Service/travel.service';
import { UserService } from './Service/UserService';
import { AdminComponent } from './Component/admin/admin.component';
import { ReviewService } from './Service/ReviewService';

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
    FinalAddtoCartComponent,
    CountryAddtocartComponent,
    CountriesListComponent,
    SinhalaComponent,
    HindiComponent,
    ChinesComponent,
    CurrencyConverterComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    LucideAngularModule.pick({ Globe, Plane, Star }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    CurrencyConverterService,
    AuthService,
    BookingService,
    PaymentService,
    TravelService,
    UserService,
    ReviewService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
