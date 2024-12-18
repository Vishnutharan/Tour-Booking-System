// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginCredentials, LoginDto,LoginResponse,RegisterDto,TokenResponse } from '../Model/auth.models';

@Injectable({
  providedIn: 'root'
})
 export class AuthService {
  private apiUrl = 'https://localhost:7063/api/Auth';
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if token exists in local storage on service initialization
    const token = localStorage.getItem('authToken');
    if (token) {
      this.currentUserSubject.next(this.getUsernameFromToken(token));
    }
  }

  register(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          // Store the token
          localStorage.setItem('authToken', response.token);
          
          // Set current user
          const username = this.getUsernameFromToken(response.token);
          this.currentUserSubject.next(username);
        }
      })
    );
  }

  public logout(): void {
    // Remove token from local storage
    localStorage.removeItem('authToken');
    
    // Clear current user
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

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

  getCurrentUsername(): string | null {
    return this.currentUserSubject.value;
  }
}