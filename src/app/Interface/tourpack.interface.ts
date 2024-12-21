export interface Review {
  id?: number;
  tourPackageId: number;
  customerName: string;
  rating: number;
  reviewText: string;
  createdAt?: Date;
}

export interface Skill {
  icon: string;
  title: string;
  description: string;
}

export interface SocialLink {
  icon: string;
  url: string;
}

export interface TourPackage {
  id: number;
  title: string;
  description: string;
  src: string;
  category?: string;
  price?: number;
}
