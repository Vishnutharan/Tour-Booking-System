import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from '../Model/UserInfo.models';
import { AuthService } from './AuthService';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7063/api/Users'; // Update with your API URL
  constructor(private http: HttpClient,    private authService: AuthService  ) { }

  // addUser(user: UserInfo): Observable<{ message: string }> {
  //   return this.http.post<{ message: string }>(this.apiUrl, user, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //   });
  // }

  getUsers(): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, user: UserInfo): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // addUser(user: UserInfo): Observable<{ message: string }> {
  //   const userId = this.authService.getUserIdFromToken();
  //   if (userId) {
  //     user.userId = userId;
  //   }
  //   return this.http.post<{ message: string }>(this.apiUrl, user, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //   });
  // }
  addUser(user: UserInfo, headers?: any): Observable<any> {
    return this.http.post(this.apiUrl, user, { headers });
  }
  updateCurrentUser(user: UserInfo): Observable<{ message: string }> {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      throw new Error('No authenticated user found');
    }
  
    // Convert userId to number
    const userIdAsNumber = Number(userId);
    if (isNaN(userIdAsNumber)) {
      throw new Error('Invalid userId');
    }
  
    return this.updateUser(userIdAsNumber, user);
  }
  
}
