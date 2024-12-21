import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Country, TouristPlace, CartItem } from 'src/app/Interface/travel.interface';

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private readonly mockCountries: Country[] = [
    {
      id: 'fr',
      name: 'France',
      description: 'The land of art, culture, and cuisine.',
      imageUrl: '/assets/tourbook9.webp',
      featuredScore: 4.8
    },
    {
      id: 'jp',
      name: 'Japan',
      description: 'A blend of tradition and modern technology.',
      imageUrl: '/assets/tourbook2.webp',
      featuredScore: 4.9
    },
    {
      id: 'br',
      name: 'Brazil',
      description: 'Home to stunning beaches and vibrant culture.',
      imageUrl: '/assets/tourbook3.webp',
      featuredScore: 4.7
    }
  ];

  private readonly mockTouristPlaces: TouristPlace[] = [
    {
      id: 'fr',
      countryId: 'fr',
      name: 'Eiffel Tower',
      description: 'Iconic iron lattice tower on the Champ de Mars in Paris.',
      imageUrl: '/assets/tourbook9.webp',
      cost: 25,
      rating: 4.7,
      highlights: ['Skip-the-line access', 'Panoramic city views', 'Restaurant dining'],
      bestTimeToVisit: 'Sunset',
      duration: '2-3 hours'
    }
  ];

  private cartItems = new BehaviorSubject<CartItem[]>([]);

  // Fetch countries
  getCountries(): Observable<Country[]> {
    return of(this.mockCountries);
  }

  // Fetch country details by ID
  getCountryById(id: string): Observable<Country> {
    const country = this.mockCountries.find(c => c.id === id);
    return of(country!);
  }
  
  getTouristPlaces(countryId: string): Observable<TouristPlace[]> {
    return of(this.mockTouristPlaces.filter(place => place.countryId === countryId));
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(place: TouristPlace): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.placeId === place.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItems.next([...currentItems]);
    } else {
      const newItem: CartItem = {
        placeId: place.id,
        countryId: place.countryId,
        name: place.name,
        cost: place.cost,
        quantity: 1,
        details: place.description,
        image: place.imageUrl
      };
      this.cartItems.next([...currentItems, newItem]);
    }
  }

  removeFromCart(placeId: string): void {
    const currentItems = this.cartItems.value;
    this.cartItems.next(currentItems.filter(item => item.placeId !== placeId));
  }

  updateQuantity(placeId: string, quantity: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.placeId === placeId);
    if (item) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
  }
}