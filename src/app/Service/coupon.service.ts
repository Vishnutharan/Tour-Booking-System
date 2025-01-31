import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Coupon {
  code: string;
  discountPercentage: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  isValid: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private readonly availableCoupons: Coupon[] = [
    { code: 'TRAVEL10', discountPercentage: 10, minimumAmount: 100, isValid: true },
    { code: 'SUMMER20', discountPercentage: 20, minimumAmount: 200, maximumDiscount: 100, isValid: true },
    { code: 'HOLIDAY25', discountPercentage: 25, minimumAmount: 500, maximumDiscount: 200, isValid: true }
  ];

  private appliedCouponSubject = new BehaviorSubject<Coupon | null>(null);
  appliedCoupon$ = this.appliedCouponSubject.asObservable();

  validateCoupon(code: string, cartTotal: number): boolean {
    const coupon = this.availableCoupons.find(c => c.code === code.toUpperCase());
    
    if (!coupon || !coupon.isValid) {
      return false;
    }

    if (coupon.minimumAmount && cartTotal < coupon.minimumAmount) {
      return false;
    }

    this.appliedCouponSubject.next(coupon);
    return true;
  }

  calculateDiscount(total: number): number {
    const coupon = this.appliedCouponSubject.value;
    if (!coupon) return 0;

    let discount = (total * coupon.discountPercentage) / 100;
    
    if (coupon.maximumDiscount) {
      discount = Math.min(discount, coupon.maximumDiscount);
    }

    return Math.round(discount * 100) / 100;
  }

  clearCoupon(): void {
    this.appliedCouponSubject.next(null);
  }

  getAppliedCoupon(): Observable<Coupon | null> {
    return this.appliedCoupon$;
  }
}   