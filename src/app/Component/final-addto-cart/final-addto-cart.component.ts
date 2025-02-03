import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem, Country, TouristPlace } from 'src/app/Model/travel.models';
import { AuthService } from 'src/app/Service/AuthService';
import { TravelService } from 'src/app/Service/travel.service';
import { BookingService } from 'src/app/Service/BookingService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BookingDetails } from 'src/app/Model/bookingdetails';
import { UserOptions } from 'jspdf-autotable';

interface TableRow {
  content: string;
  styles?: {
    halign?: 'left' | 'center' | 'right';
    fillColor?: [number, number, number];
    textColor?: [number, number, number];
  };
  colSpan?: number;
}

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
    this.loadCartItems();
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
      placess: JSON.stringify(
        this.cartItems.map((item) => ({
          name: item.name,
          cost: item.cost,
          quantity: item.quantity,
          countryId: item.countryId,
          placeId: item.placeId,
        }))
      ),
    };

    this.bookingService.createBooking(bookingDetails).subscribe({
      next: (response) => {
        console.log('Booking successful:', response);
        this.router.navigate(['/paymentonline']);
      },
      error: (error) => {
        console.error('Booking error:', error);
      },
    });
  }

  downloadInvoice(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;

    // Add background color and decorative elements
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header with logo placeholder
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Travel Invoice', margin, 25);

    // Add current date
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 60, 25);

    // User Information section
    const userInfo = localStorage.getItem('userDetails');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(12);

      // Customer Details Box
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, 50, pageWidth - margin * 2, 40, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.text('Customer Details', margin + 5, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${user.name}`, margin + 5, 70);
      doc.text(`Email: ${user.email}`, margin + 5, 80);
      doc.text(`Phone: ${user.phone || 'N/A'}`, pageWidth - 80, 70);
    }

    // Cart Items Table with improved styling
    const tableHeaders: Array<Array<TableRow>> = [[
      { 
        content: '#',
        styles: { 
          halign: 'center',
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255]
        }
      },
      {
        content: 'Place Name',
        styles: {
          halign: 'left',
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255]
        }
      },
      {
        content: 'Cost',
        styles: {
          halign: 'right',
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255]
        }
      },
      {
        content: 'Qty',
        styles: {
          halign: 'center',
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255]
        }
      },
      {
        content: 'Total',
        styles: {
          halign: 'right',
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255]
        }
      }
    ]];

    const tableData: Array<Array<TableRow>> = this.cartItems.map((item, index) => [
      { content: (index + 1).toString(), styles: { halign: 'center' } },
      { content: item.name, styles: { halign: 'left' } },
      { content: `$${item.cost.toFixed(2)}`, styles: { halign: 'right' } },
      { content: item.quantity.toString(), styles: { halign: 'center' } },
      {
        content: `$${(item.cost * item.quantity).toFixed(2)}`,
        styles: { halign: 'right' }
      }
    ]);

    autoTable(doc, {
      head: tableHeaders,
      body: tableData,
      startY: 100,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 11,
        cellPadding: 5,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
    } as UserOptions);

    let finalY = (doc as any).lastAutoTable.finalY + 20;

    // Detailed sections for each destination
    this.cartItems.forEach((item, index) => {
      if (finalY > pageHeight - 60) {
        doc.addPage();
        finalY = 20;
      }

      // Destination header
      doc.setFillColor(41, 128, 185);
      doc.setTextColor(255, 255, 255);
      doc.roundedRect(margin, finalY, pageWidth - margin * 2, 12, 2, 2, 'F');
      doc.setFontSize(14);
      doc.text(`Destination ${index + 1}: ${item.name}`, margin + 5, finalY + 9);
      finalY += 20;

      // Details grid
      const detailsData: Array<Array<TableRow | string>> = [
        [{
          content: 'Travel Information',
          colSpan: 2,
          styles: { fillColor: [236, 240, 241] }
        }],
        ['Transportation', item.travelDetails.transportationMode],
        ['Duration', item.travelDetails.travelDuration],
        ['Travel Cost', `$${item.travelDetails.cost?.toFixed(2) || 'N/A'}`],
        [{
          content: 'Accommodation',
          colSpan: 2,
          styles: { fillColor: [236, 240, 241] }
        }],
        ['Hotel', item.accommodation.hotelName],
        ['Room Type', item.accommodation.roomType],
        ['Check-In', item.accommodation.checkInDate || 'N/A'],
        ['Check-Out', item.accommodation.checkOutDate || 'N/A'],
        [{
          content: 'Tourist Guide',
          colSpan: 2,
          styles: { fillColor: [236, 240, 241] }
        }],
        ['Guide Name', item.touristGuideDetails.guideName],
        ['Experience', item.touristGuideDetails.experience],
        ['Languages', item.touristGuideDetails.languagesSpoken.join(', ')],
        ['Contact', item.touristGuideDetails.contactNumber]
      ];

      autoTable(doc, {
        body: detailsData,
        startY: finalY,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 10,
          cellPadding: 4,
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 40 },
          1: { cellWidth: 'auto' },
        },
        theme: 'grid',
      } as UserOptions);

      finalY = (doc as any).lastAutoTable.finalY + 15;

      // Highlights section
      if (item.highlights?.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(41, 128, 185);
        doc.setFont('helvetica', 'bold');
        doc.text('Highlights:', margin, finalY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);

        item.highlights.forEach((highlight, i) => {
          finalY += 7;
          doc.setFontSize(10);
          doc.text(`• ${highlight}`, margin + 5, finalY);
        });

        finalY += 15;
      }
    });

    // Final Summary Box
    if (finalY > pageHeight - 80) {
      doc.addPage();
      finalY = 20;
    }

    // Summary box with shadow effect
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - 90, finalY, 80, 50, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);

    const summaryY = finalY + 10;
    doc.text('Subtotal:', pageWidth - 85, summaryY);
    doc.text(`$${this.totalAmount.toFixed(2)}`, pageWidth - 20, summaryY, {
      align: 'right',
    });

    doc.text('Tax (10%):', pageWidth - 85, summaryY + 12);
    doc.text(`$${(this.totalAmount * 0.1).toFixed(2)}`, pageWidth - 20, summaryY + 12, {
      align: 'right',
    });

    doc.setFont('helvetica', 'bold');
    doc.text('Total:', pageWidth - 85, summaryY + 30);
    doc.text(`$${(this.totalAmount * 1.1).toFixed(2)}`, pageWidth - 20, summaryY + 30, {
      align: 'right',
    });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text('Thank you for choosing our travel services!', pageWidth / 2, pageHeight - 15, {
      align: 'center',
    });

    // Save the PDF
    doc.save('trip-invoice.pdf');
  }

  closePopup() {
    this.router.navigate(['/country', this.countryID]);
  }

  @Output() closePopupEvent = new EventEmitter<void>();

  onClosePopup() {
    this.closePopupEvent.emit();
  }
}