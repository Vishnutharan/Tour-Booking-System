import { Component } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  showDatePicker = false;
  showGuestPicker = false;
  showDestinationPicker = false;

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  toggleGuestPicker() {
    this.showGuestPicker = !this.showGuestPicker;
  }

  toggleDestinationPicker() {
    this.showDestinationPicker = !this.showDestinationPicker;
  }
}