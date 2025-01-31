import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem, Country, TouristPlace } from 'src/app/Model/travel.models';
import { AuthService } from 'src/app/Service/AuthService';
import { TravelService } from 'src/app/Service/travel.service';
import { BookingService } from 'src/app/Service/BookingService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import { BookingRequest } from 'src/app/Model/bookingdetails';
import { BookingDetails } from 'src/app/Model/bookingdetails';

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
    const userId = this.authservice.getUserId();
    
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }
  
    const userInfo = localStorage.getItem('userDetails');
    const user = userInfo ? JSON.parse(userInfo) : null;
  
    const bookingDetails = {
      userId: parseInt(userId),
      bookingDate: new Date(),
      status: 'Pending',
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfTravel: new Date(),
      numberOfPeople: 1,
      totalAmount: this.totalAmount,
      tax: this.totalAmount * 0.1,
      finalAmount: this.totalAmount * 1.1,
      placess: JSON.stringify(this.cartItems.map(item => ({
        name: item.name,
        cost: item.cost,
        quantity: item.quantity,
        countryId: item.countryId,
        placeId: item.placeId
      })))
    };
  
    this.bookingService.createBooking(bookingDetails).subscribe({
      next: (response) => {
        console.log('Booking successful:', response);
        this.router.navigate(['/paymentonline']);
      },
      error: (error) => {
        console.error('Booking error:', error);
      }
    });
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
