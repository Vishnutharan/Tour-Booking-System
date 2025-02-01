import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TouristPlace } from '../Model/travel.models';

@Injectable({
  providedIn: 'root'
})
export class TouristPlaceService {
  private apiUrl = 'https://localhost:7063/api/TouristPlaces';

  constructor(private http: HttpClient) {}

  getAllPlaces(): Observable<TouristPlace[]> {
    return this.http.get<TouristPlace[]>(this.apiUrl);
  }

  getPlacesByCountry(countryId: string): Observable<TouristPlace[]> {
    return this.http.get<TouristPlace[]>(`${this.apiUrl}/country/${countryId}`);
  }

  getPlaceById(id: string): Observable<TouristPlace> {
    return this.http.get<TouristPlace>(`${this.apiUrl}/${id}`);
  }

  createPlace(place: TouristPlace): Observable<TouristPlace> {
    return this.http.post<TouristPlace>(this.apiUrl, place);
  }

  updatePlace(id: string, place: TouristPlace): Observable<TouristPlace> {
    return this.http.put<TouristPlace>(`${this.apiUrl}/${id}`, place);
  }

  deletePlace(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}