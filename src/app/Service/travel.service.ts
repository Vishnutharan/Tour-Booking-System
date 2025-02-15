import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Country, TouristPlace, CartItem,  } from '../Model/travel.models';
import { mockCountries } from '../mock-data/mock-countries';
import { mockTouristPlaces } from '../mock-data/mock-tourist-places';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './AuthService';
import { BookingDetails } from '../Model/bookingdetails';
@Injectable({
  providedIn: 'root',
})
export class TravelService {
  private apiUrl = 'https://localhost:7063/api/Booking';
  private mockCountries = mockCountries;
  private mockTouristPlaces = mockTouristPlaces;
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getCountries(): Observable<Country[]> {
    return of(this.mockCountries);
  }

  getCountryById(id: string): Observable<Country> {
    const country = this.mockCountries.find((c) => c.Id === id);
    return of(country!);
  }

  getTouristPlaces(countryId: string): Observable<TouristPlace[]> {
    return of(
      this.mockTouristPlaces.filter((place) => place.countryId === countryId)
    );
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(place: TouristPlace): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find((item) => item.placeId === place.placeId);
  
    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItems.next([...currentItems]);
    } else {
      const newItem: CartItem = {
        placeId: place.placeId,
        countryId: place.countryId,
        name: place.name,
        cost: place.cost,
        quantity: 1,
        details: place.description,
        imageUrl: place.imageUrl,
        image: place.imageUrl,  
        description: place.description,
        rating: place.rating,
        highlights: place.highlights,
        bestTimeToVisit: place.bestTimeToVisit,
        duration: place.duration,
        accommodation: place.accommodation,
        travelDetails: place.travelDetails,
        checkIn: place.checkIn,
        checkOut: place.checkOut,
        touristGuideDetails:place.touristGuideDetails
      };
      this.cartItems.next([...currentItems, newItem]);
    }
  }
  removeFromCart(placeId: string): void {
    const currentItems = this.cartItems.value;
    this.cartItems.next(
      currentItems.filter((item) => item.placeId !== placeId)
    );
  }

  updateQuantity(placeId: string, quantity: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find((item) => item.placeId === placeId);
    if (item) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
  }

  confirmBooking(bookingDetails: BookingDetails): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User not authenticated. Token is missing.');
    }
  
    const currentItems = this.cartItems.value;
    const totalAmount = currentItems.reduce(
      (total, item) => total + item.cost * item.quantity,
      0
    );
  
    const userId = this.authService.getUserId();
    if (!userId) {
      throw new Error('User ID could not be extracted from token.');
    }
  
    const booking = {
      userId: userId,
      bookingDetails: {
        ...bookingDetails,
        totalAmount: totalAmount,
        tax: totalAmount * 0.1,
        finalAmount: totalAmount * 1.1,
        bookingDate: new Date(),
        status: 'Pending',
      },
      placesitems: currentItems.map((item) => ({
        placeId: item.placeId,
        countryId: item.countryId,
        name: item.name,
        cost: item.cost,
        quantity: item.quantity,
        totalCost: item.cost * item.quantity,
      })),
    };
  
    return this.http.post(`${this.apiUrl}/create`, booking);
  }
  
  getUserBookings(): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.get(`${this.apiUrl}/Booking/user/${userId}`);
  }

  getBookingById(bookingId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Booking/${bookingId}`);
  }

  resetCart(): void {
    this.cartItems.next([]);
  }
}