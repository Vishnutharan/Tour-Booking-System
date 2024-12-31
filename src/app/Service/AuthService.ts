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

  constructor(private http: HttpClient, private router: Router) {
    // Initialize user state from stored token
    const token = localStorage.getItem('authToken');
    if (token) {
      this.currentUserSubject.next(this.getUsernameFromToken(token));
    }
  }

  // User registration
  register(credentials: LoginDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  // User login with token handling
  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response?.token) {
          localStorage.setItem('authToken', response.token);
          this.currentUserSubject.next(this.getUsernameFromToken(response.token));
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

  // Get current username
  getCurrentUsername(): string | null {
    return this.currentUserSubject.value;
  }
}
