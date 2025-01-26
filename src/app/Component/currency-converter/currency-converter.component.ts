import { Component, OnInit } from '@angular/core';
import { CurrencyConverterService } from 'src/app/Service/CurrencyConService';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent  {

  fromCurrency: string = '';
  toCurrency: string = '';
  amount: number = 0;
  conversionResult: any = null;

  constructor(private currencyService: CurrencyConverterService) { }

  convert() {
    this.currencyService.convertCurrency(this.fromCurrency, this.toCurrency, this.amount)
      .subscribe({
        next: (result) => {
          this.conversionResult = result;
        },
        error: (error) => {
          console.error('Error during conversion:', error);
        }
      });
  }
}