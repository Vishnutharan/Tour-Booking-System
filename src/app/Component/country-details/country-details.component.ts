import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/Model/travel.models';
import { CountryService } from 'src/app/Service/CountryService';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.css']
})
export class CountryDetailsComponent implements OnInit {
  countries: Country[] = [];
  country: Country = {
    Id: '',
    name: '',
    description: '',
    imageUrl: '',
    featuredScore: 0
  };
  isEditing = false;

  constructor(private countryService: CountryService) { }

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe(
      countries => this.countries = countries
    );
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.countryService.updateCountry(this.country.Id, this.country).subscribe({
        next: () => {
          this.loadCountries();
          this.resetForm();
        }
      });
    } else {
      this.countryService.createCountry(this.country).subscribe({
        next: () => {
          this.loadCountries();
          this.resetForm();
        }
      });
    }
  }

  editCountry(country: Country): void {
    this.country = { ...country };
    this.isEditing = true;
  }

  deleteCountry(id: string): void {
    if (confirm('Are you sure you want to delete this country?')) {
      this.countryService.deleteCountry(id).subscribe({
        next: () => this.loadCountries()
      });
    }
  }

  resetForm(): void {
    this.country = {
      Id: '',
      name: '',
      description: '',
      imageUrl: '',
      featuredScore: 0
    };
    this.isEditing = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.country.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}