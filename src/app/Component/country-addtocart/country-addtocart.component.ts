import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingDetails, CartItem, Country, TouristPlace } from 'src/app/Model/travel.models';
import { AuthService } from 'src/app/Service/AuthService';
import { TravelService } from 'src/app/Service/travel.service';

@Component({
  selector: 'app-country-addtocart',
  templateUrl: './country-addtocart.component.html',
  styleUrls: ['./country-addtocart.component.css']
})
export class CountryAddtocartComponent implements OnInit {
  countryId!: string;
  countryDetails!: Country;
  touristPlaces: TouristPlace[] = [];
  cartItems: CartItem[] = [];
  filteredTouristPlaces: TouristPlace[] = [];
  searchQuery: string = '';
  totalAmount = 0;
  bookingDetails: BookingDetails = {
    name: '',
    email: '',
    phone: '',
    dateOfTravel: new Date(),
    numberOfPeople: 1,
  };

  private prevScrollPos: number = window.pageYOffset;
  private searchSortBar: any; // To hold the reference to the DOM element

  constructor(
    private route: ActivatedRoute,
    private travelService: TravelService,
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2

  ) {}

  ngOnInit(): void {
    this.countryId = this.route.snapshot.paramMap.get('id')!;
    this.loadCountryDetails();
    this.loadTouristPlaces();
    this.loadCartItems();
  }

  private loadCountryDetails(): void {
    this.travelService.getCountryById(this.countryId).subscribe((details) => {
      this.countryDetails = details;
    });
  }

  private loadTouristPlaces(): void {
    this.travelService.getTouristPlaces(this.countryId).subscribe((places) => {
      this.touristPlaces = places;
      this.filteredTouristPlaces = places;
    });
  }

  private loadCartItems(): void {
    this.travelService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  addToCart(place: TouristPlace): void {
    this.travelService.addToCart(place);
  }

  removeFromCart(placeId: string): void {
    this.travelService.removeFromCart(placeId);
  }

  resetCart(): void {
    this.cartItems = [];
    this.totalAmount = 0;
    this.travelService.clearCart();
  }

  updateQuantity(placeId: string, quantity: number): void {
    if (quantity > 0) {
      this.travelService.updateQuantity(placeId, quantity);
    }
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.cost * item.quantity,
      0
    );
  }

  printItinerary(): void {
    window.print();
  }

  updateDates(place: TouristPlace, checkIn: string, checkOut: string): void {
    place.checkIn = new Date(checkIn);
    place.checkOut = new Date(checkOut);
  }

  proceedToPayment(): void {
    console.log('Proceeding to payment');
  }

  confirmBooking(): void {
    if (!this.authService.isAuthenticated()) {
      console.error('User is not logged in. Redirecting to login page.');
      this.router.navigate(['/login']);
      return;
    }
  }

  sortPlaces(sortBy: string): void {
    this.filteredTouristPlaces = [...this.touristPlaces];
    if (sortBy === 'price') {
      this.filteredTouristPlaces.sort((a, b) => a.cost - b.cost);
    } else if (sortBy === 'rating') {
      this.filteredTouristPlaces.sort((a, b) => b.rating - a.rating);
    }
  }

  searchPlaces(): void {
    if (!this.searchQuery) {
      this.filteredTouristPlaces = this.touristPlaces;
    } else {
      this.filteredTouristPlaces = this.touristPlaces.filter(place => place.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScrollPos = window.pageYOffset;
    if (!this.searchSortBar) {
      this.searchSortBar = document.querySelector('.search-sort-bar');
    }

    if (currentScrollPos > 0) {  // Always hide if the user has scrolled from the top
      this.renderer.addClass(this.searchSortBar, 'hidden');
    } else {
      this.renderer.removeClass(this.searchSortBar, 'hidden');
    }

    this.prevScrollPos = currentScrollPos;
  }

}