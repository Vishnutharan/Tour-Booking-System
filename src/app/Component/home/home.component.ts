import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  skills = [
    {
      icon: 'globe',
      title: 'Tour Planning',
      description: 'Designing and organizing the best travel itineraries for unforgettable experiences.',
    },
    {
      icon: 'airplane',
      title: 'Flight Booking',
      description: 'Helping travelers find the best flights with flexible options and competitive prices.',
    },
    {
      icon: 'hotel',
      title: 'Hotel Reservations',
      description: 'Securing comfortable and affordable accommodations for every type of traveler.',
    },
    {
      icon: 'car',
      title: 'Car Rentals',
      description: 'Offering convenient car rental options for smooth travels wherever you go.',
    },
    {
      icon: 'star',
      title: 'Customer Service',
      description: 'Providing exceptional support and assistance to ensure a seamless travel experience.',
    },
    {
      icon: 'ticket',
      title: 'Booking Management',
      description: 'Managing travel bookings, including tour packages, flights, and hotel reservations.',
    }
  ];
  

  socialLinks = [
    { icon: 'github', url: '#' },
    { icon: 'linkedin', url: '#' },
    { icon: 'twitter', url: '#' },
  ];

  tourPackages = [
    {
      id: 1,
      title: 'Adventure Tour',
      description: 'Explore the world with exciting adventure packages.',
      src: "/assets/tourbook1.webp"
    },
    {
      id: 2,
      title: 'Beach Vacation',
      description: 'Relax on the most beautiful beaches around the world.',
      src: "/assets/tourbook2.webp"
    },
    {
      id: 3,
      title: 'Mountain Expedition',
      description: 'Conquer majestic mountains with expert guides and scenic views.',
      src: "/assets/tourbook3.webp"
    },
    {
      id: 4,
      title: 'City Escape',
      description: 'Discover the best city breaks with luxury accommodations and top attractions.',
      src: "/assets/tourbook4.webp"
    },
    {
      id: 5,
      title: 'Wildlife Safari',
      description: 'Go on an exhilarating wildlife safari and witness amazing animal species in their natural habitat.',
      src: "/assets/tourbook5.webp"
    },
    {
      id: 6,
      title: 'Tropical Getaway',
      description: 'Experience the serenity of the tropics with pristine beaches and crystal-clear waters.',
      src: "/assets/tourbook6.webp"
    },
    {
      id: 7,
      title: 'Cultural Expedition',
      description: 'Immerse yourself in the rich culture and heritage of ancient cities and traditions.',
      src: "/assets/tourbook9.webp"
    },
    {
      id: 8,
      title: 'Luxury Cruise',
      description: 'Set sail on a luxurious cruise to exotic locations with all-inclusive amenities.',
      src: "/assets/tourbook10.webp"
    }
  ];
  
 
  constructor() {}

  ngOnInit(): void {}
}