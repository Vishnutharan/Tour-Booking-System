import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../Model/travel.models';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'https://localhost:7063/api/Reviews';

  constructor(private http: HttpClient) {}

  submitReview(review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/submit`, review);
  }
  
  getReviews(tourPackageId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/package/${tourPackageId}`);
  }
}