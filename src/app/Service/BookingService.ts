import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingDetails, CreateBookingResponse } from 'src/app/Model/bookingdetails';
// import { BookingRequest } from 'src/app/Model/bookingdetails';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'https://localhost:7063/api/Booking';

  constructor(private http: HttpClient) { }


  createBooking(bookingDetails: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type', 'application/json'
    );
    return this.http.post(`${this.apiUrl}/create`, bookingDetails, { headers });
  }
  
  getUserBookings(): Observable<BookingDetails[]> {
    return this.http.get<BookingDetails[]>(`${this.apiUrl}/get`);
  }

  getBookingById(id: number): Observable<BookingDetails> {
    return this.http.get<BookingDetails>(`${this.apiUrl}/get/${id}`);
  }

  updateBooking(id: number, booking: BookingDetails): Observable<{ message: string, bookingId: number }> {
    return this.http.put<{ message: string, bookingId: number }>(`${this.apiUrl}/update/${id}`, booking, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteBooking(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete/${id}`);
  }
  getBookingDetails(bookingId: number): Observable<BookingDetails> {
    return this.http.get<BookingDetails>(`${this.apiUrl}/${bookingId}`);
  }
  // Add methods for Excel export and import
  exportBookingsToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-excel`, {
      responseType: 'blob' // Important: Set responseType to 'blob'
    });
  }

  importBookingsFromExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // 'file' should match the parameter name expected by your backend
    return this.http.post(`${this.apiUrl}/import-excel`, formData);
  }
}