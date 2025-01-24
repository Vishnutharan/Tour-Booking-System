export interface BookingDetails {
    id?: number;
    userId: string;
    bookingDate: Date;
    status: string;
    places?: string;
    name?: string;
    email?: string;
    phone?: string;
    dateOfTravel?: Date;
    numberOfPeople: number;
    totalAmount?: number;
    finalAmount?: number;
    tax?: number;
  }

  export interface CreateBookingResponse {
    message: string;
    bookingId: number;
  }

interface TourBookingDetails {
  id?: number;
  userId: string;
  bookingDate: Date;
  places?: string[];
  dateOfTravel: Date;
  numberOfPeople: number;
  totalAmount: number;
  finalAmount: number;
  tax: number;
}
interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
  nationality?: string;
  dateOfBirth?: Date;
  passportOrIdInfo?: string;
}
interface AccommodationDetails {
  hotelName?: string;
  roomType?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  numberOfRooms?: number;
  occupancyDetails?: string;
  specialRoomRequests?: string;
}
interface AdditionalInformation {
  travelPreferences?: string;
  dietaryRequirements?: string;
 
}
