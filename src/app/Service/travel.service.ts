import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Country, TouristPlace, CartItem } from 'src/app/Interface/travel.interface';

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  resetCart() {
    throw new Error('Method not implemented.');
  }
  private readonly mockCountries: Country[] = [
    {
      id: 'fr',
      name: 'France',
      description: 'The land of art, culture, and cuisine.',
      imageUrl: '/assets/dd2.webp',
      featuredScore: 4.8
    },
    {
      id: 'jp',
      name: 'Japan',
      description: 'A blend of tradition and modern technology.',
      imageUrl: '/assets/dd4.webp',
      featuredScore: 4.9
    },
    {
      id: 'br',
      name: 'Brazil',
      description: 'Home to stunning beaches and vibrant culture.',
      imageUrl: '/assets/dd8.webp',
      featuredScore: 4.5
    },
    {
      id: 'ind',
      name: 'india',
      description: 'Home to stunning beaches and vibrant culture.',
      imageUrl: '/assets/dd6.webp',
      featuredScore: 4.4
    },
    {
      id: 'sri',
      name: 'Srilanka',
      description: 'Home to stunning beaches and vibrant culture.',
      imageUrl: '/assets/dd11.webp',
      featuredScore: 4.0
    },
    {
      id: 'cad',
      name: 'canada',
      description: 'Home to stunning beaches and vibrant culture.',
      imageUrl: '/assets/dd10.webp',
      featuredScore: 4.7
    },
    {
      id: 'usa',
      name: 'USA',
      description: 'Home to stunning beaches and vibrant culture.',
      imageUrl: '/assets/dd14.webp',
      featuredScore: 4.7
    },
    {
      id: 'uk',
      name: 'UK',
      description: 'Home to stunning beaches and vibrant culture.',
      imageUrl: '/assets/dd16.webp',
      featuredScore: 4.7
    }
  ];

  private readonly mockTouristPlaces: TouristPlace[] = [
    {
      id: 'fr1',
      countryId: 'fr',
      name: 'Eiffel Tower',
      description: 'Iconic iron lattice tower on the Champ de Mars in Paris.',
      imageUrl: '/assets/tourbook9.webp',
      cost: 125,
      rating: 4.7,
      highlights: ['Skip-the-line access', 'Panoramic city views', 'Restaurant dining'],
      bestTimeToVisit: 'Sunset',
      duration: '2-3 hours',
    },
    {
      id: 'fr2',
      countryId: 'fr',
      name: 'Louvre Museum',
      description: 'World-famous museum housing iconic works like the Mona Lisa and Venus de Milo.',
      imageUrl: '/assets/tourbook13.webp',
      cost: 100,
      rating: 4.8,
      highlights: ['Art masterpieces', 'Skip-the-line access', 'Audio-guided tours'],
      bestTimeToVisit: 'Morning',
      duration: '3-4 hours',
    },
    {
      id: 'fr3',
      countryId: 'fr',
      name: 'Palace of Versailles',
      description: 'Lavish palace showcasing French opulence with stunning gardens.',
      imageUrl: '/assets/tourbook14.webp',
      cost: 120,
      rating: 4.6,
      highlights: ['Palace tours', 'Fountain shows', 'Beautiful gardens'],
      bestTimeToVisit: 'Spring',
      duration: '4-5 hours',
    },
    {
      id: 'br1',
      countryId: 'br',
      name: 'Christ the Redeemer',
      description: 'Iconic statue overlooking Rio de Janeiro, offering breathtaking views.',
      imageUrl: '/assets/tourbook1.webp',
      cost: 30,
      rating: 4.9,
      highlights: ['Panoramic views', 'Guided tours', 'Cultural significance'],
      bestTimeToVisit: 'Morning',
      duration: '2-3 hours',
    },
    {
      id: 'br2',
      countryId: 'br',
      name: 'Sugarloaf Mountain',
      description: 'Granite peak with cable car rides and sweeping views of Rio.',
      imageUrl: '/assets/tourbook4.webp',
      cost: 35,
      rating: 4.8,
      highlights: ['Cable car rides', 'City and ocean views', 'Photography spots'],
      bestTimeToVisit: 'Evening',
      duration: '2-3 hours',
    },
    {
      id: 'br3',
      countryId: 'br',
      name: 'Iguazu Falls',
      description: 'Majestic waterfalls located on the border between Brazil and Argentina.',
      imageUrl: '/assets/tourbook5.webp',
      cost: 50,
      rating: 4.9,
      highlights: ['Boat tours', 'Hiking trails', 'Nature views'],
      bestTimeToVisit: 'Autumn',
      duration: '3-4 hours',
    },
    {
      id: 'jp1',
      countryId: 'jp',
      name: 'Hillbase Tower',
      description: 'Modern tower offering panoramic views of the bustling Tokyo skyline.',
      imageUrl: '/assets/tourbook10.webp',
      cost: 50,
      rating: 4.7,
      highlights: ['Skip-the-line access', 'Panoramic city views', 'Traditional tea ceremony'],
      bestTimeToVisit: 'Evening',
      duration: '2-3 hours',
    },
    {
      id: 'jp2',
      countryId: 'jp',
      name: 'Mount Fuji',
      description: 'Japan’s tallest peak, a symbol of the nation with hiking and stunning views.',
      imageUrl: '/assets/tourbook6.webp',
      cost: 40,
      rating: 4.9,
      highlights: ['Hiking trails', 'Scenic vistas', 'Photography spots'],
      bestTimeToVisit: 'Autumn',
      duration: '5-6 hours',
    },
    {
      id: 'jp3',
      countryId: 'jp',
      name: 'Arashiyama Bamboo Grove',
      description: 'Serene bamboo forest offering a peaceful and picturesque atmosphere.',
      imageUrl: '/assets/tourbook7.webp',
      cost: 20,
      rating: 4.8,
      highlights: ['Bamboo forest walks', 'Tranquil atmosphere', 'Photography'],
      bestTimeToVisit: 'Morning',
      duration: '1-2 hours',
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