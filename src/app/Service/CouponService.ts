import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coupon } from '../Model/coupon.models';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private apiUrl = 'https://localhost:7063/api/Coupons';

  constructor(private http: HttpClient) {}

  getCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.apiUrl);
  }

  createCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(this.apiUrl, coupon);
  }

  updateCoupon(id: number, coupon: Coupon): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.apiUrl}/${id}`, coupon);
  }

  // In CouponService
  deleteCoupon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  validateCoupon(code: string, amount: number): Observable<Coupon> {
    return this.http.post<Coupon>(`${this.apiUrl}/validate`, { code, amount });
  }
}