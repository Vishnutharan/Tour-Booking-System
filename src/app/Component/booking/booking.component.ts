import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TravelService } from 'src/app/Service/travel.service';
import { Country } from 'src/app/Model/travel.models';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent implements OnInit {
  countries: Country[] = [];

  constructor(private travelService: TravelService, private router: Router) {}

  ngOnInit(): void {
    // Fetch countries on initialization
    this.travelService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
  }

  // Navigate to detailed page of the country
  navigateToCountryDetails(countryId: string): void {
    this.router.navigate(['/country', countryId]);
  }
}
