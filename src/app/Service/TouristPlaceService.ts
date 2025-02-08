// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
// import { TouristPlace } from '../Model/travel.models';
// import { mockTouristPlaces } from '../mock-data/mock-tourist-places';
// import { catchError, map, switchMap, tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class TouristPlaceService {
//   private apiUrl = 'https://localhost:7063/api/TouristPlace'; // Replace with your actual API endpoint
//   private placesSubject = new BehaviorSubject<TouristPlace[]>([]);
//   places$ = this.placesSubject.asObservable();

//   constructor(private http: HttpClient) {
//     this.loadInitialData();
//   }

//   private loadInitialData() {
//     // Load data from API on initialization.  If it fails, fallback to mock data.
//     this.http.get<TouristPlace[]>(this.apiUrl).pipe(
//       catchError(error => {
//         console.error("Error loading initial data from API:", error);
//         console.warn("Falling back to mock data.");
//         return of(mockTouristPlaces); // Use mock data if API call fails
//       })
//     ).subscribe(places => {
//       this.placesSubject.next(places);
//     });
//   }

//   getPlaces(): Observable<TouristPlace[]> {
//     return this.places$;
//   }

//   getPlacesByCountry(countryId: string): Observable<TouristPlace[]> {
//     // Try to get from cache first
//     const cachedPlaces = this.placesSubject.value.filter(p => p.countryId === countryId);
//     if (cachedPlaces.length > 0) {
//         return of(cachedPlaces);
//     }

//     // If not in cache (or cache is empty), fetch from API
//     return this.http.get<TouristPlace[]>(`${this.apiUrl}?countryId=${countryId}`).pipe(
//         catchError(error => {
//             console.error("Error fetching places by country ID from API:", error);
//             return of([]); // Return empty array on error.  Could also re-throw.
//         }),
//          // Optionally update the BehaviorSubject with the results for future use
//          tap(places => {
//             if(places.length > 0) {  // Only add if there *are* results
//                 const currentPlaces = this.placesSubject.value;
//                 // Add only the *new* places. Avoid duplicates
//                 const newPlaces = places.filter(newPlace => !currentPlaces.some(existingPlace => existingPlace.id === newPlace.id));
//                 this.placesSubject.next([...currentPlaces, ...newPlaces]);
//             }
//         })
//     );
// }


//   getPlaceById(id: string): Observable<TouristPlace | undefined> {
//     // First, check the local cache
//     const cachedPlace = this.placesSubject.value.find(p => p.id === id);
//     if (cachedPlace) {
//       return of(cachedPlace);
//     }

//     // If not in cache, fetch from API
//     return this.http.get<TouristPlace>(`${this.apiUrl}/${id}`).pipe(
//         catchError(error => {
//             console.error("Error fetching place by ID from API:", error);
//             return of(undefined); // Return undefined if not found or error.
//         })
//     );
//   }

//   addPlace(place: TouristPlace): Observable<TouristPlace> {
//     return this.http.post<TouristPlace>(this.apiUrl, place).pipe(
//       tap(newPlace => {
//         const currentPlaces = this.placesSubject.value;
//         this.placesSubject.next([...currentPlaces, newPlace]);
//       }),
//       catchError(error => {
//         console.error("Error adding place:", error);
//         throw error; // Re-throw
//       })
//     );
//   }

//   updatePlace(updatedPlace: TouristPlace): Observable<TouristPlace> {
//     return this.http.put<TouristPlace>(`${this.apiUrl}/${updatedPlace.id}`, updatedPlace).pipe(
//       tap(() => {
//         const currentPlaces = this.placesSubject.value;
//         const index = currentPlaces.findIndex(p => p.id === updatedPlace.id);
//         if (index !== -1) {
//           currentPlaces[index] = updatedPlace;
//           this.placesSubject.next([...currentPlaces]);
//         }
//       }),
//       catchError(error => {
//         console.error("Error updating place:", error);
//         throw error; // Re-throw
//       })
//     );
//   }


//   deletePlace(id: string): Observable<void> {
//     return this.http.delete(`${this.apiUrl}/${id}`).pipe(
//       switchMap(() => {
//         const currentPlaces = this.placesSubject.value;
//         this.placesSubject.next(currentPlaces.filter(p => p.id !== id));
//         return of(undefined); // Return Observable<void>
//       }),
//       catchError(error => {
//         console.error("Error deleting place:", error);
//         throw error;  // Re-throw the error
//       })
//     );
//   }
// }