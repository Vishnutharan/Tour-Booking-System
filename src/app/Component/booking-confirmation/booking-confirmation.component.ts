import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {

  bookingReference: string;

  constructor(private router: Router) {
    // Generate a random booking reference
    this.bookingReference = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  ngOnInit(): void {
    // You can add any initialization logic here
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  viewBookings(): void {
    this.router.navigate(['/my-bookings']);
  }
}