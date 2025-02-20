import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../Model/travel.models';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = 'https://localhost:7063/api/Countries';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiUrl);
  }

  getCountry(id: string): Observable<Country> {
    return this.http.get<Country>(`${this.apiUrl}/${id}`);
  }

  createCountry(country: Country): Observable<Country> {
    if (!country.CountryId) {
      country.CountryId = crypto.randomUUID(); // Manually generate ID if not provided
    }
    return this.http.post<Country>(this.apiUrl, country);
  }

  updateCountry(id: string, country: Country): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, country);
  }

  deleteCountry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}