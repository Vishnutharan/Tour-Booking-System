import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginDto, LoginResponse } from 'src/app/Model/auth.models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7063/api/Auth';
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private userId: string | null = null; // Variable to store user ID

  constructor(private http: HttpClient, private router: Router) {
  const token = localStorage.getItem('authToken');
  if (token && this.isValidToken(token)) {
    this.currentUserSubject.next(this.getUsernameFromToken(token));
  } else {
    localStorage.removeItem('authToken'); // Clear invalid token
    console.error('Token is invalid or expired.');
  }
}
  // User registration
  register(credentials: LoginDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response?.token) {
          console.log('Saving token:', response.token); // Debug log
          localStorage.setItem('authToken', response.token);
        }
        else {
          console.error('AuthService: No token received'); // Debug log
        }
      })
    );
  }
  
  // User logout and cleanup
  logout(): void {
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/home']);
  }

  // Check authentication status
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Extract username from JWT token
  private getUsernameFromToken(token: string): string | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const payload = JSON.parse(window.atob(base64));
      return payload.unique_name || payload.name;
    } catch {
      return null;
    }
  }

  // Extract user ID from JWT token
  //  private getUserIdFromToken(token: string): string | null {
  //   try {
  //     const base64Url = token.split('.')[1];
  //     const base64 = base64Url.replace('-', '+').replace('_', '/');
  //     const payload = JSON.parse(window.atob(base64));
  //     return payload.sub; // Assuming 'sub' contains the user ID
  //   } catch {
  //     return null;
  //   }
  // }

  private getUserIdFromToken(token: string): string | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const payload = JSON.parse(window.atob(base64));
      console.log('Decoded token payload:', payload); // Debugging log
  
      // Extract the user ID from the correct claim
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  getUserId(): string | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    return this.getUserIdFromToken(token);
  }
  

  // Get current username
  getCurrentUsername(): string | null {
    return this.currentUserSubject.value;
  }
 
  validateToken(): void {
    const token = localStorage.getItem('authToken');
    if (!token || !this.isValidToken(token)) {
      console.error('Invalid or expired token.');
      localStorage.removeItem('authToken');
      throw new Error('Invalid or expired token');
    }
  }
  
  private isValidToken(token: string): boolean {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const payload = JSON.parse(window.atob(base64));
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  
      if (payload.exp && payload.exp < currentTime) {
        console.error('Token is expired');
        return false;
      }
  
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }
  isAuthenticated(): boolean {
    // Check for the presence of a valid authentication token in local storage or cookies
    const token = localStorage.getItem('authToken');
    return token !== null && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    // Decode the token and check if it's expired
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }
}