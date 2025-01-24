import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingDetails } from 'src/app/Model/bookingdetails';
import { BookingService } from 'src/app/Service/BookingService';
@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {
  booking: BookingDetails | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.loadBookingDetails();
  }

  loadBookingDetails() {
    this.loading = true;
    this.error = null;

    const bookingId = this.route.snapshot.params['id'];
    if (!bookingId) {
        this.error = "Invalid Booking ID."
        return
    }

    this.bookingService.getBookingDetails(bookingId).subscribe({
        next: (booking) => {
            this.booking = booking;
            this.loading = false;
        },
        error: (err) => {
            this.error = err.error || "Failed to load booking details."
            this.loading = false;
        }
    })
  }
}