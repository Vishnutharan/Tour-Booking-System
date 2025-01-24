import { Component, OnInit } from '@angular/core';
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
  totalAmount = 0;
  bookingDetails: BookingDetails = {
    name: '',
    email: '',
    phone: '',
    dateOfTravel: new Date(),
    numberOfPeople: 1,
  };

  constructor(
    private route: ActivatedRoute, //The Route provides the details, like parameters or data, that are passed to the component when navigating
    private travelService: TravelService,
    private router:Router ,//The Router handles navigation between components,
    private authService: AuthService //The AuthService provides methods for user authentication and authorization
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
    // Implement payment gateway integration
    console.log('Proceeding to payment');
  }

  confirmBooking(): void {
    // Check if the user is authenticated
    if (!this.authService.isAuthenticated()) {
      console.error('User is not logged in. Redirecting to login page.');
      this.router.navigate(['/login']); // Redirect to login page if not logged in
      return;
    }
  
  } 
}