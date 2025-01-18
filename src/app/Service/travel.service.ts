import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Country,TouristPlace,CartItem,BookingDetails,} from '../Model/travel.models';
import { mockCountries } from '../mock-data/mock-countries';
import { mockTouristPlaces } from '../mock-data/mock-tourist-places';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './AuthService';

@Injectable({
  providedIn: 'root',
})
export class TravelService {
  private apiUrl = 'https://localhost:7063/api/Booking';
  private mockCountries = mockCountries;
  private mockTouristPlaces = mockTouristPlaces;
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  constructor(private http: HttpClient,private authService: AuthService
  ) {} // Inject HttpClient service

  resetCart() {
    throw new Error('Method not implemented.');
  }

  // Fetch countries && display a list of countries.
  getCountries(): Observable<Country[]> {
    return of(this.mockCountries);
  }

  // Fetch country details by ID && display the details of a specific country.
  getCountryById(id: string): Observable<Country> {
    const country = this.mockCountries.find((c) => c.id === id);
    return of(country!);
  }
  // display a list of TouristPlace.
  getTouristPlaces(countryId: string): Observable<TouristPlace[]> {
    return of(
      this.mockTouristPlaces.filter((place) => place.countryId === countryId)
    );
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  // It uses this object to check if the place already exists in the cart.
  // If it does, it updates the quantity of that item.
  // If it doesn't, it creates a new CartItem using the information from the TouristPlace object (like name, cost, etc.) and adds it to the cart.

  addToCart(place: TouristPlace): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find((item) => item.placeId === place.id);

    if (existingItem) {
      // If the item already exists in the cart, increment the quantity
      existingItem.quantity += 1;
      this.cartItems.next([...currentItems]);
    } else {
      // If the item does not exist, create a new item with all required fields
      const newItem: CartItem = {
        placeId: place.id,
        countryId: place.countryId,
        name: place.name,
        cost: place.cost,
        quantity: 1,
        details: place.description, // Assuming 'description' is the same as 'details'
        image: place.imageUrl,
        description: place.description, // Explicitly add 'description'
        rating: place.rating || 0, // Default to 0 if not provided
        highlights: place.highlights || [], // Default to an empty array if not provided
        bestTimeToVisit: place.bestTimeToVisit || 'Not specified', // Default message
        duration: place.duration || 'Unknown', // Default to 'Unknown' if not provided
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
    const currentItems = this.cartItems.value;
    const totalAmount = currentItems.reduce(
      (total, item) => total + item.cost * item.quantity,
      0
    );
    
    const userId = this.authService.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const booking = {
      userId: userId,
      bookingDetails: {
        ...bookingDetails,
        totalAmount: totalAmount,
        tax: totalAmount * 0.1,
        finalAmount: totalAmount * 1.1,
        bookingDate: new Date(),
        status: 'Pending'
      },
      placesitems: currentItems.map(item => ({
        placeId: item.placeId,
        countryId: item.countryId,
        name: item.name,
        cost: item.cost,
        quantity: item.quantity,
        totalCost: item.cost * item.quantity
      }))
    };

    return this.http.post(`${this.apiUrl}/Booking/create`, booking);
  }

  getUserBookings(): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.get(`${this.apiUrl}/Booking/user/${userId}`);
  }

  getBookingById(bookingId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Booking/${bookingId}`);
  }
}