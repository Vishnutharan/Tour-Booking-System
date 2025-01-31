import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/AuthService';
import { BookingService } from 'src/app/Service/BookingService';
import { CreateBookingResponse } from 'src/app/Model/bookingdetails';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  bookingSuccess: boolean = false;
  bookingError: string | null = null;
  userId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {
    this.bookingForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dateOfTravel: [null, Validators.required],
      numberOfPeople: [1, [Validators.required, Validators.min(1)]],
      totalAmount: [0, Validators.required],
      tax: [0],
      finalAmount: [0],
      places: [''],
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    console.log('User ID from Auth Service:', this.userId);
    
    if (!this.userId) {
      console.error('User ID not found, redirecting to Login.');
      this.router.navigate(['/login']);
      return;
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.userId) {
      this.bookingError = null;
      const bookingData = {
        ...this.bookingForm.value,
        userId: this.userId,
        bookingDate: new Date(),
        status: 'Pending'
      };

      this.bookingService.createBooking(bookingData).subscribe({
        next: (response: CreateBookingResponse) => {
          console.log('Booking created successfully', response);
          this.bookingSuccess = true;
          this.router.navigate(['/booking-details', response.bookingId]);
        },
        error: (error) => {
          console.error('Error creating booking:', error);
          this.bookingError = 'Failed to create booking. Please try again.';
          this.bookingSuccess = false;
        },
      });
    } else {
      this.bookingError = 'Form is invalid';
      console.log('Form is not valid');
    }
  }

  calculateFinalAmount() {
    const totalAmount = this.bookingForm.get('totalAmount')?.value || 0;
    const taxRate = this.bookingForm.get('tax')?.value || 0;
    
    const tax = totalAmount * (taxRate / 100);
    const finalAmount = totalAmount + tax;
    
    this.bookingForm.patchValue({
      finalAmount: finalAmount
    });
  }
}