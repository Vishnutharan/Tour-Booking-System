import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TravelService } from 'src/app/Service/travel.service';
import { faGlobe, faPlane, faStar } from '@fortawesome/free-solid-svg-icons';
import { Country } from 'src/app/Model/travel.models';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.css'],
})
export class CountriesListComponent implements OnInit {
  countries: Country[] = [];
  constructor(private router: Router, private travelService: TravelService) {}

  ngOnInit(): void {
    this.travelService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
  }

  navigateToCountryDetails(countryId: string): void {
    this.router.navigate(['/country', countryId]);
  }
}