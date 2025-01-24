import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Service/AuthService';
import { BookingDetails } from 'src/app/Model/bookingdetails';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/Service/BookingService';
@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: BookingDetails[] = [];
  loading: boolean = true;
  error: string | null = null;

   constructor(
        private bookingService: BookingService,
        private authService: AuthService,
         private router : Router
    ) { }

    ngOnInit(): void {
        this.loadUserBookings();
    }


    loadUserBookings() {
        this.loading = true;
         this.error = null;

         this.bookingService.getUserBookings().subscribe({
            next: (bookings) => {
                this.bookings = bookings;
                 this.loading = false;
            },
            error: (err) => {
                this.error = err.error || "Failed to load booking."
                this.loading = false;
            }
         })
    }

    viewBookingDetails(bookingId : number){
      this.router.navigate(['/booking-details', bookingId]);
    }

    logout(){
      this.authService.logout();
    }
}