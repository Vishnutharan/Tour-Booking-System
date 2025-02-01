import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Review } from "../Model/travel.models";

@Injectable({
  providedIn: "root",
})
export class ReviewService {
  private apiUrl = "https://localhost:7063/api/Reviews";

  constructor(private http: HttpClient) {}

  getReviewsByPackageId(tourPackageId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/package/${tourPackageId}`);
  }

  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  submitReview(review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/submit`, review, {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    });
  }

  updateReview(id: number, review: Review): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, review, {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    });
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getReviews(tourPackageId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/package/${tourPackageId}`);
  }
}