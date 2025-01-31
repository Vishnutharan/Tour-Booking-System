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