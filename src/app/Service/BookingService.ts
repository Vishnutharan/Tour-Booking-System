import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingDetails, BookingRequest, CreateBookingResponse } from 'src/app/Model/bookingdetails';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'https://localhost:7063/api/Booking';

  constructor(private http: HttpClient) {}

  createBooking(bookingDetails: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type', 'application/json'
    );

    return this.http.post(`${this.apiUrl}/create`, bookingDetails, { headers });
  }

  getUserBookings(): Observable<BookingDetails[]> {
    return this.http.get<BookingDetails[]>(`${this.apiUrl}/mybookings`);
  }

  getBookingDetails(bookingId: number): Observable<BookingDetails> {
    return this.http.get<BookingDetails>(`${this.apiUrl}/${bookingId}`);
  }
}
