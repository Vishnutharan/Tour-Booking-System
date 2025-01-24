import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingDetails, CreateBookingResponse } from 'src/app/Model/bookingdetails';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'https://localhost:7063/api/Booking'; // API endpoint

  constructor(private http: HttpClient) {}

  createBooking(booking: any, token: string): Observable<CreateBookingResponse> {
    // Add the token to the headers
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<CreateBookingResponse>(`${this.apiUrl}/create`, booking, { headers });
  }

  getUserBookings(): Observable<BookingDetails[]> {
    return this.http.get<BookingDetails[]>(`${this.apiUrl}/mybookings`);
  }

  getBookingDetails(bookingId: number): Observable<BookingDetails> {
    return this.http.get<BookingDetails>(`${this.apiUrl}/${bookingId}`);
  }
}
