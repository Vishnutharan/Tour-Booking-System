import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TravelService } from 'src/app/Service/travel.service';
import { CartItem, Country, TouristPlace } from 'src/app/Model/travel.models';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.css'],
})
export class CountryDetailsComponent implements OnInit {
  countryId!: string;
  countryDetails!: Country;
  touristPlaces: TouristPlace[] = [];
  cartItems: CartItem[] = [];
  totalAmount = 0;

  constructor(
    private route: ActivatedRoute,
    private travelService: TravelService
  ) {}

  ngOnInit(): void {
    this.countryId = this.route.snapshot.paramMap.get('id')!;
    this.loadCountryDetails();
    this.loadTouristPlaces();
    this.loadCartItems();
  }

  private loadCountryDetails(): void {
    this.travelService.getCountryById(this.countryId).subscribe(details => {
      this.countryDetails = details;
    });
  }

  private loadTouristPlaces(): void {
    this.travelService.getTouristPlaces(this.countryId).subscribe(places => {
      this.touristPlaces = places;
    });
  }

  private loadCartItems(): void {
    this.travelService.getCartItems().subscribe(items => {
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
    this.totalAmount = this.cartItems.reduce((total, item) => 
      total + (item.cost * item.quantity), 0);
  }

  printItinerary(): void {
    window.print();
  }

  proceedToPayment(): void {
    // Implement payment gateway integration
    console.log('Proceeding to payment');
  }

  confirmBooking():void {
    
  }
}