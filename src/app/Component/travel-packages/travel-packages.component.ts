import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Country } from 'src/app/Interface/travel.interface';
import { TravelService } from 'src/app/Service/travel.service';

  @Component({
    selector: 'app-travel-packages',
    templateUrl: './travel-packages.component.html',
    styleUrls: ['./travel-packages.component.css']
  })
  export class TravelPackagesComponent {
    countries = [
      {
        name: 'Italy',
        description: 'Explore the beautiful cities and cuisine of Italy.',
        image: 'assets/images/italy.jpg',
        places: [
          {
            name: 'Rome',
            details: 'The capital city of Italy, known for its history.',
            price: 200,
            image: 'assets/images/rome.jpg'
          },
          {
            name: 'Venice',
            details: 'Famous for its canals and gondolas.',
            price: 250,
            image: 'assets/images/venice.jpg'
          }
        ]
      },
      {
        name: 'France',
        description: 'Experience the romance and art of France.',
        image: 'assets/images/france.jpg',
        places: [
          {
            name: 'Paris',
            details: 'The city of lights and the Eiffel Tower.',
            price: 300,
            image: 'assets/images/paris.jpg'
          },
          {
            name: 'Nice',
            details: 'A beautiful city on the French Riviera.',
            price: 280,
            image: 'assets/images/nice.jpg'
          }
        ]
      },
      {
        name: 'Japan',
        description: 'Discover the culture and technology of Japan.',
        image: 'assets/images/japan.jpg',
        places: [
          {
            name: 'Tokyo',
            details: 'The bustling capital city of Japan.',
            price: 400,
            image: 'assets/images/tokyo.jpg'
          },
          {
            name: 'Kyoto',
            details: 'Famous for its classical Buddhist temples.',
            price: 350,
            image: 'assets/images/kyoto.jpg'
          }
        ]
      }
    ];
  
    selectedCountry: any = null;
    cart: any[] = [];
    bookingDetails = { name: '', email: '', phone: '' };
    isBookingPage = false;
  
    get cartTotal() {
      return this.cart.reduce((total, item: any) => total + item.price, 0);
    }
  
    navigateToCountryDetails(country: any) {
      this.selectedCountry = country;
    }
  
    addToCart(place: any) {
      this.cart.push(place);
    }
  
    goToBookingPage() {
      this.isBookingPage = true;
    }
  
    submitBooking() {
      alert('Booking submitted successfully!');
      this.cart = [];
      this.bookingDetails = { name: '', email: '', phone: '' };
      this.isBookingPage = false;
    }
  
    printDetails() {
      window.print();
    }
  }
  