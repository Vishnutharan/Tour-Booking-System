export interface Coupon {
    id: number;  // Adding id for proper deletion
    code: string;
    discountPercentage: number;
    expiryDate: Date;
    minimumAmount: number;
    maximumDiscount: number;
    usageLimit: number;
    usageCount: number;
    isActive: boolean;
  }