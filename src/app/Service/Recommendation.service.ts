import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../Environment/environments';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = environments.apiUrl;

  constructor(private http: HttpClient) { }

  getRecommendation(age: number, rating: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommend`, { age, rating });
  }

  getPlaces(): Observable<any> {
    return this.http.get(`${this.apiUrl}/places`);
  }

  getStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`);
  }
}