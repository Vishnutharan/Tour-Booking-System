import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginDto, LoginResponse } from 'src/app/Model/auth.models';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7063/api/Auth';
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private userId: string | null = null;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('authToken');
    if (token && this.isValidToken(token)) {
      this.currentUserSubject.next(this.getUsernameFromToken(token));
    } else {
      localStorage.removeItem('authToken');
      console.error('Token is invalid or expired.');
    }
  }

  register(credentials: LoginDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response?.token) {
          console.log('Saving token:', response.token);
          localStorage.setItem('authToken', response.token);
        }
        else {
          console.error('AuthService: No token received');
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/home']);
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

  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        // Check for possible key names where userId might be stored
        const userId = decodedToken.userId || decodedToken.sub || decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        return userId || null; // Return userId if found, otherwise null
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }
  

  // Add this method to maintain compatibility
  getUserId(): string | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const payload = JSON.parse(window.atob(base64));
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

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
      const currentTime = Math.floor(Date.now() / 1000);
  
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
    const token = localStorage.getItem('authToken');
    return token !== null && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }
}