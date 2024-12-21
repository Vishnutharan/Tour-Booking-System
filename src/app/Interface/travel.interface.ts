export interface Country {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    featuredScore: number;
  }
  
  export interface TouristPlace {
    id: string;
    countryId: string;
    name: string;
    description: string;
    imageUrl: string;
    cost: number;
    rating: number;
    highlights: string[];
    bestTimeToVisit: string;
    duration: string;
  }
  
  export interface CartItem {
    placeId: string;
    countryId: string;
    name: string;
    cost: number;
    quantity: number;
    details: string;
    image: string;
  }
  
  export interface BookingDetails {
    name: string;
    email: string;
    phone: string;
    dateOfTravel?: Date;
    numberOfPeople?: number;
  }