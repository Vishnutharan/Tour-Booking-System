import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TouristPlaceBackend } from '../Model/travel.models';

@Injectable({
  providedIn: 'root'
})
export class TouristPlaceService {
  private apiUrl = 'https://localhost:7063/api/TouristPlaces';
  
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  getTouristPlaces(): Observable<TouristPlaceBackend[]> {
    return this.http.get<TouristPlaceBackend[]>(this.apiUrl);
  }

  getTouristPlace(id: number): Observable<TouristPlaceBackend> {
    return this.http.get<TouristPlaceBackend>(`${this.apiUrl}/${id}`);
  }

  createTouristPlace(place: TouristPlaceBackend): Observable<TouristPlaceBackend> {
    return this.http.post<TouristPlaceBackend>(this.apiUrl, place, { headers: this.headers });
  }

  updateTouristPlace(id: number, place: TouristPlaceBackend): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, place, { headers: this.headers });
  }

  deleteTouristPlace(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData, { responseType: 'text' });
  }
}