import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from '../Model/UserInfo.models';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7063/api/Users'; // Update with your API URL

  constructor(private http: HttpClient) { }

  addUser(userInfo: UserInfo): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userInfo);
  }

  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, bookingData);
  }
}