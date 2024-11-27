import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

// Define interfaces for the responses
interface AuthResponse {
  token: string;  // Assuming 'token' is the field returned in the login response
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:7063/api/auth';

  constructor(private http: HttpClient) {}

  // Register method (assuming no token in the response)
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Login method (expects a token in the response)
  login(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Login Error:', error);
        return throwError(() => new Error('Login failed. Please try again later.'));
      })
    );
  }
}
