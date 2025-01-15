import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelService } from 'src/app/Service/travel.service';
import { BookingDetails,CartItem,Country,TouristPlace,} from 'src/app/Model/travel.models';

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
    private router:Router //The Router handles navigation between components
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

  proceedToPayment(): void {
    // Implement payment gateway integration
    console.log('Proceeding to payment');
  }

  confirmBooking(): void {
    this.travelService.confirmBooking(this.bookingDetails).subscribe({
      next: response => {
        console.log('Booking confirmed:', response);
        this.resetCart();
        this.router.navigate(['/confirmbooking']);
      },
      error: error => {
        console.error('Booking failed:', error);
      }
    });
  }
}
