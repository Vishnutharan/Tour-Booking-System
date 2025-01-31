export interface Review {
  id?: number;
  tourPackageId: number;
  customerName: string;
  rating: number;
  reviewText: string;
  createdAt?: Date;
  userImage?: string; 
  date: Date;
}


  export interface TourPackage {
    id: number;
    title: string;
    description: string;
    src: string;
    category?: string;
    price?: number;
  }
  