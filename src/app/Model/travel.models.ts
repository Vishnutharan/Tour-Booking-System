export interface Country {
  CountryId: string; 
  name: string;
  description: string;
  imageUrl: string;
  featuredScore: number;
}

export interface TouristPlace {
  PlaceId: string;
  countryId: string;
  placeId: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  highlights: string[];
  bestTimeToVisit: string;
  duration: string;
  cost: number;
  checkIn?: Date;
  checkOut?: Date;
  accommodation: {
    hotelName: string;
    roomType: string;
    specialRequests?: string;
    checkInDate?: string;
    checkOutDate?: string;
    numberOfRooms?: number;
    occupancyDetails?: string;
  };
  travelDetails: {
    transportationMode: string;
    travelDuration: string;
    cost?: number;
  };
  touristGuideDetails: {
    guideName: string;
    experience: string;
    languagesSpoken: string[];
    contactNumber: string;
    specialization: string[];
  };
}

export interface TouristPlaceBackend {
  placeId: number;
  placeName: string;
  countryId: string;
  description?: string;
  imageUrl?: string;
  cost: number;
  rating: number;
  highlights?: string[];
  bestTimeToVisit?: string;
  duration?: string;
  hotelName?: string;
  roomType?: string;
  specialRequests?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  numberOfRooms?: number;
  occupancyDetails?: string;
  transportationMode?: string;
  travelDuration?: string;
  travelCost?: number;
  guideName: string;
  experience: string;
  languagesSpoken: string[];
  contactNumber: string;
  specialization: string[];
}
export interface CartItem extends Omit<TouristPlace, 'PlaceId'> {
  quantity: number;
  details: string;
  image: string;
  checkIn?: Date;
  checkOut?: Date;
}

export interface Review {
  id: number;
  customerName: string;
  rating: number;
  reviewText: string;
  tourPackageId: number;
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
