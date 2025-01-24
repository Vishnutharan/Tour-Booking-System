import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem, Country, TouristPlace } from 'src/app/Model/travel.models';
import { AuthService } from 'src/app/Service/AuthService';
import { TravelService } from 'src/app/Service/travel.service';
import { BookingService } from 'src/app/Service/BookingService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-final-addto-cart',
  templateUrl: './final-addto-cart.component.html',
  styleUrls: ['./final-addto-cart.component.css'],
})
export class FinalAddtoCartComponent implements OnInit {
  countryID!: string;
  countryDetails!: Country;
  touristPlaces: TouristPlace[] = [];
  cartItems: CartItem[] = [];
  totalAmount = 0;

  constructor(
    private route: ActivatedRoute,
    private travelservice: TravelService,
    private authservice: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.countryID = this.route.snapshot.paramMap.get('id')!;
    this.loadcountryDetails();
    this.loadTouristPlaces();
    this.loadCartItems();
  }

  private loadcountryDetails(): void {
    this.travelservice.getCountryById(this.countryID).subscribe((details) => {
      this.countryDetails = details;
    });
  }

  private loadTouristPlaces(): void {
    this.travelservice.getTouristPlaces(this.countryID).subscribe((places) => {
      this.touristPlaces = places;
    });
  }

  private loadCartItems(): void {
    this.travelservice.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  private calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (acc, item) => acc + item.cost * item.quantity,
      0
    );
  }

  removeFromCart(placeId: string): void {
    this.travelservice.removeFromCart(placeId);
  }

  proceedToPay(): void {
    const token = localStorage.getItem('authToken'); // Retrieve the token
  
    if (!token) {
      // If no token, redirect to login
      alert('You must log in before proceeding to pay.');
      this.router.navigate(['/login']);
      return;
    }
  
    // Validate the token (optional: can be moved to AuthService)
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (payload.exp < currentTime) {
        alert('Your session has expired. Please log in again.');
        this.router.navigate(['/login']);
        return;
      }
    } catch (error) {
      console.error('Invalid token:', error);
      alert('Invalid token. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }
  
    // Prepare booking details
    const bookingDetails = {
      touristPlaces: this.cartItems.map((item) => ({
        name: item.name,
        cost: item.cost,
        quantity: item.quantity,
        description: item.description,
        rating: item.rating,
        highlights: item.highlights,
        accommodation: item.accommodation,
        travelDetails: item.travelDetails,
      })),
      totalAmount: this.totalAmount,
    };
    
  
    // Send the booking details along with the token
    this.bookingService.createBooking(bookingDetails, token).subscribe(
      (response) => {
        alert('Booking created successfully!');
        console.log('Booking response:', response); // Debug log
        this.router.navigate(['/paymentonline']); // Redirect to payment page
      },
      (error) => {
        if (error.status === 401) {
          alert('Unauthorized! Please log in again.');
          this.router.navigate(['/login']);
        } else {
          alert('Error creating booking: ' + error.message);
          console.error('Booking error:', error); // Debug log
        }
      }
    );
  }
  
  
  
  downloadInvoice(): void {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Trip Invoice', 10, 15);

    // User Information (optional)
    const userInfo = localStorage.getItem('userDetails');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      doc.setFontSize(12);
      doc.text(`Name: ${user.name}`, 10, 25);
      doc.text(`Email: ${user.email}`, 10, 30);
    }

    // Cart Items Table
    const cartTableData = this.cartItems.map((item, index) => [
      index + 1,
      item.name,
      `$${item.cost.toFixed(2)}`,
      item.quantity,
      `$${(item.cost * item.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [['#', 'Place Name', 'Cost per Item', 'Quantity', 'Total Cost']],
      body: cartTableData,
      startY: 40,
      styles: { halign: 'center', valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
        4: { cellWidth: 40 },
      },
    });

    let finalY = (doc as any).lastAutoTable.finalY + 10;
    this.cartItems.forEach((item, index) => {
      // Add section header for each item
      doc.setFontSize(14);
      doc.text(`Details for: ${item.name}`, 10, finalY);

      // Details Table
      const detailsTableData = [
        ['Description', item.description],
        ['Rating', item.rating],
        ['Best Time to Visit', item.bestTimeToVisit],
        ['Duration', item.duration],
        ['Transportation Mode', item.travelDetails.transportationMode],
        ['Travel Duration', item.travelDetails.travelDuration],
        ['Travel Cost', `$${item.travelDetails.cost?.toFixed(2) || 'N/A'}`],
      ];

      autoTable(doc, {
        body: detailsTableData,
        startY: finalY + 5,
        theme: 'grid',
        styles: { cellPadding: 2, fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: 140 },
        },
      });

      // Accommodation Details Table
      finalY = (doc as any).lastAutoTable.finalY + 5;
      doc.setFontSize(12);
      doc.text('Accommodation Details:', 10, finalY);

      const accommodationData = [
        ['Hotel Name', item.accommodation.hotelName],
        ['Room Type', item.accommodation.roomType],
        ['Special Requests', item.accommodation.specialRequests || 'None'],
        ['Check-In', item.accommodation.checkInDate || 'N/A'],
        ['Check-Out', item.accommodation.checkOutDate || 'N/A'],
      ];

      autoTable(doc, {
        body: accommodationData,
        startY: finalY + 5,
        theme: 'grid',
        styles: { cellPadding: 2, fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: 140 },
        },
      });

      // Add Highlights Section
      finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text('Highlights:', 10, finalY);

      const highlightsData = item.highlights.map((highlight) => [highlight]);
      autoTable(doc, {
        body: highlightsData,
        startY: finalY + 5,
        theme: 'striped',
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 190 },
        },
      });

      finalY = (doc as any).lastAutoTable.finalY + 10;
      if (finalY > 270) {
        doc.addPage();
        finalY = 10;
      }
    });

    // Total Summary Table
    const summaryTableData = [
      ['Subtotal', `$${this.totalAmount.toFixed(2)}`],
      ['Tax (10%)', `$${(this.totalAmount * 0.1).toFixed(2)}`],
      ['Total', `$${(this.totalAmount * 1.1).toFixed(2)}`],
    ];

    autoTable(doc, {
      body: summaryTableData,
      startY: finalY + 10,
      theme: 'grid',
      styles: { fontSize: 12, fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { cellWidth: 95 },
        1: { cellWidth: 95 },
      },
    });

    // Save the PDF
    doc.save('trip-invoice.pdf');
  }

  closePopup() {
    // Emit an event or use a service to close the popup
    this.router.navigate(['/country', this.countryID]);
  }

  @Output() closePopupEvent = new EventEmitter<void>();

  onClosePopup() {
    this.closePopupEvent.emit();
  }
}
