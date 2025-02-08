// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject, of, tap } from 'rxjs';
// import { Country } from '../Model/travel.models';
// import { mockCountries } from '../mock-data/mock-countries';
// import { switchMap, catchError, map } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class CountryService {
//   private apiUrl = 'https://localhost:7063/api/Country'; // Replace with your actual API endpoint
//   private countriesSubject = new BehaviorSubject<Country[]>([]);
//   countries$ = this.countriesSubject.asObservable();

//   constructor(private http: HttpClient) {
//     this.loadInitialData();
//   }

//   private loadInitialData() {
//     // Load data from API on initialization.  If it fails, fallback to mock data.
//     this.http.get<Country[]>(this.apiUrl).pipe(
//       catchError(error => {
//         console.error("Error loading initial data from API:", error);
//         console.warn("Falling back to mock data.");
//         return of(mockCountries); // Use mock data if API call fails
//       })
//     ).subscribe(countries => {
//       this.countriesSubject.next(countries);
//     });
//   }


//   getCountries(): Observable<Country[]> {
//     return this.countries$;
//   }

//   getCountryById(id: string): Observable<Country | undefined> {
//     // First, try to find the country in the local cache (BehaviorSubject)
//     const cachedCountry = this.countriesSubject.value.find(c => c.countryId === id);
//     if (cachedCountry) {
//       return of(cachedCountry); // Return from cache if found
//     }

//     // If not in cache, fetch from the API
//     return this.http.get<Country>(`${this.apiUrl}/${id}`).pipe(
//         catchError(error => {
//             console.error("Error fetching country by ID from API:", error);
//             return of(undefined); // or throw error;  Returning undefined is generally better for UI.
//         })
//     );
//   }


//   addCountry(country: Country): Observable<Country> {
//     return this.http.post<Country>(this.apiUrl, country).pipe(
//       tap(newCountry => {
//         const currentCountries = this.countriesSubject.value;
//         this.countriesSubject.next([...currentCountries, newCountry]);
//       }),
//       catchError(error => {
//         console.error("Error adding country:", error);
//         throw error; // Re-throw the error for the component to handle
//       })
//     );
//   }

//   updateCountry(updatedCountry: Country): Observable<Country> {
//         return this.http.put<Country>(`${this.apiUrl}/${updatedCountry.countryId}`, updatedCountry).pipe(
//             tap(() => {
//                 //Optimistically update the local state
//                 const currentCountries = this.countriesSubject.value;
//                 const index = currentCountries.findIndex(c => c.countryId === updatedCountry.countryId);
//                 if (index !== -1) {
//                     currentCountries[index] = updatedCountry;
//                     this.countriesSubject.next([...currentCountries]);
//                 }
//             }),
//             catchError(error => {
//                 console.error("Error updating country:", error);
//                 throw error; // Re-throw for component
//             })
//     );
// }


//   deleteCountry(id: string): Observable<void> {
//     return this.http.delete(`${this.apiUrl}/${id}`).pipe(
//       switchMap(() => {  //Use switchMap to ensure previous operations complete
//         const currentCountries = this.countriesSubject.value;
//         this.countriesSubject.next(currentCountries.filter(c => c.countryId !== id));
//         return of(undefined); // Return an Observable<void>
//       }),
//       catchError(error => {
//         console.error("Error deleting country:", error);
//         throw error;  // Re-throw
//       })
//     );
//   }
// }