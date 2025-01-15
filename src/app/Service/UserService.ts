import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from '../Model/UserInfo.models';

export class UserService {

  private apiUrl = 'https://localhost:7234/api/users';

  constructor(private http: HttpClient) {}

  saveUserInfo(userInfo: UserInfo): Observable<UserInfo> {
    return this.http.post<UserInfo>(this.apiUrl, userInfo);
  }

  getUserInfo(id: number): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/${id}`);
  }

  updateUserInfo(id: number, userInfo: UserInfo): Observable<UserInfo> {
    return this.http.put<UserInfo>(`${this.apiUrl}/${id}`, userInfo);
  }
}