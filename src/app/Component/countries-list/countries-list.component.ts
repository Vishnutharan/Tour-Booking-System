import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TravelService } from 'src/app/Service/travel.service';
import { faGlobe, faPlane, faStar } from '@fortawesome/free-solid-svg-icons';
import { Country } from 'src/app/Model/travel.models';
import { CurrencyConverterService } from 'src/app/Service/CurrencyConService';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.css'],
})
export class CountriesListComponent implements OnInit {
  countries: Country[] = [];
  fromCurrency: string = '';
  toCurrency: string = '';
  amount: number = 0;
  conversionResult: any = null;
  constructor(
    private travelService: TravelService,
    private router: Router,
    private currencyService: CurrencyConverterService
  ) {}

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
  convert() {
    this.currencyService
      .convertCurrency(this.fromCurrency, this.toCurrency, this.amount)
      .subscribe({
        next: (result) => {
          this.conversionResult = result;
        },
        error: (error) => {
          console.error('Error during conversion:', error);
        },
      });
  }
}