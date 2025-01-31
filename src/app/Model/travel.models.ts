export interface Country {
  countryId: string;
  name: string;
  description: string;
  imageUrl: string;
  featuredScore: number;
}

export interface TouristPlace {
  id: string;
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
}

export interface CartItem extends Omit<TouristPlace, 'id'> {
  quantity: number;
  details: string;
  image: string;
  checkIn?: Date;
  checkOut?: Date;
}

export interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  dateOfTravel?: Date;
  numberOfPeople?: number;
}

export interface Review {
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