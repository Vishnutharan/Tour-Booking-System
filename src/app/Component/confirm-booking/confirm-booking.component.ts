import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem, Country, TouristPlace } from 'src/app/Model/travel.models';
import { TravelService } from 'src/app/Service/travel.service';

@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.component.html',
  styleUrls: ['./confirm-booking.component.css']
})
export class ConfirmBookingComponent implements OnInit {

  countryID!:string;
  countryDetails!:Country;
  touristPlaces: TouristPlace[] = [];
  cartItems: CartItem[] = [];
  totalAmount = 0;
  
  constructor(private route: ActivatedRoute,private travelservice: TravelService ) { }

  ngOnInit(): void {
    this.countryID = this.route.snapshot.paramMap.get('id')!;
    this.loadcountryDetails();
    this.loadTouristPlaces();
    this.loadCartItems();  }

  private loadcountryDetails():void{
    this.travelservice.getCountryById(this.countryID).subscribe(details=>{
      this.countryDetails = details;
    });
  }


  private loadTouristPlaces():void{
    this.travelservice.getTouristPlaces(this.countryID).subscribe(places=>{
      this.touristPlaces = places;
    });
  }

  private loadCartItems():void{
    this.travelservice.getCartItems().subscribe(items=>{
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  private calculateTotal():void{
    this.totalAmount = this.cartItems.reduce((acc,item)=>acc+(item.cost*item.quantity),0);
  }

  removeFromCart(placeId: string): void {
    this.travelservice.removeFromCart(placeId);
  }
}
