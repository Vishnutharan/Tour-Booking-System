import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConverterService {
  private apiUrl = 'https://localhost:7063/api/CurrencyConverter/convert';

  constructor(private http: HttpClient) { }

  convertCurrency(fromCurrency: string, toCurrency: string, amount: number): Observable<any> {
    const params = {
      fromCurrency,
      toCurrency,
      amount: amount.toString()
    };
    return this.http.get(this.apiUrl, { params });
  }
}