import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Component/login/login.component';
import { RegisterComponent } from './Component/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './Component/home/home.component';
import { BookingComponent } from './Component/booking/booking.component';
import { RouterModule } from '@angular/router';
import { PaymentComponent } from './Component/payment/payment.component';
import { TravelPackagesComponent } from './Component/travel-packages/travel-packages.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    BookingComponent,
    LoginComponent,
    PaymentComponent,
    TravelPackagesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,

  ],
  // providers: [AuthService],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
