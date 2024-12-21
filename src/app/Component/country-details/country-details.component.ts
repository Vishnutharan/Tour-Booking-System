import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TravelService } from 'src/app/Service/travel.service';
import { Country } from 'src/app/Interface/travel.interface';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.css']
})
export class CountryDetailsComponent implements OnInit {
  countryId!: string;
  countryDetails!: Country;

  constructor(
    private route: ActivatedRoute,
    private travelService: TravelService
  ) {}

  ngOnInit(): void {
    // Retrieve country ID from the route
    this.countryId = this.route.snapshot.paramMap.get('id')!;
    // Fetch country details from the service
    this.travelService.getCountryById(this.countryId).subscribe(details => {
      this.countryDetails = details;
    });
  }
}
