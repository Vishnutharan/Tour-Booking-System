import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/Service/payment.service';
import { TravelService } from 'src/app/Service/travel.service';
import { AuthService } from 'src/app/Service/AuthService';
import { CartItem } from 'src/app/Model/travel.models';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  loading = false;
  cartItems: CartItem[] = [];
  cardError: string = '';
  orderSummary = {
    subtotal: 0,
    tax: 0,
    total: 0
  };
  bookingDetails: any;
 
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private travelService: TravelService,
    private authservice: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      cardComplete: [false, Validators.requiredTrue],
      amount: [0]
    });
  }

  ngOnInit(): void {
    // Get booking details from route parameters
    this.route.queryParams.subscribe(params => {
      this.bookingDetails = {
        bookingId: params['bookingId'],
        amount: parseFloat(params['amount']) || 0,
        userName: params['userName'],
        userEmail: params['userEmail'],
        totalAmount: parseFloat(params['totalAmount']) || 0,
        tax: parseFloat(params['tax']) || 0,
        numberOfPeople: parseInt(params['numberOfPeople']) || 1,
        status: params['status']
      };

      // Update order summary with booking details
      this.orderSummary = {
        subtotal: this.bookingDetails.totalAmount,
        tax: this.bookingDetails.tax,
        total: this.bookingDetails.amount
      };

      // Pre-fill the form with user details
      this.paymentForm.patchValue({
        email: this.bookingDetails.userEmail,
        name: this.bookingDetails.userName,
        amount: this.bookingDetails.amount
      });
    });

    this.loadCartItems();
    this.setupCardElement();
  }

  ngOnDestroy(): void {
    this.paymentService.unmountCardElement();
  }

  private setupCardElement(): void {
    if (!this.paymentService.isElementMounted()) {
      setTimeout(() => {
        const cardElement = this.paymentService.mountCardElement('card-element');
        if (cardElement) {
          cardElement.on('change', (event) => {
            this.cardError = event.error ? event.error.message : '';
            this.paymentForm.patchValue({ cardComplete: event.complete });
            this.paymentForm.updateValueAndValidity();
          });
        }
      }, 100);
    }
  }

  private loadCartItems(): void {
    this.travelService.getCartItems().subscribe(items => {
      this.cartItems = items;
      // Only calculate totals if booking details are not available
      if (!this.bookingDetails?.amount) {
        this.calculateTotals();
      }
    });
  }

  private calculateTotals(): void {
    // Only calculate if booking details are not available
    if (!this.bookingDetails?.amount) {
      this.orderSummary.subtotal = this.cartItems.reduce(
        (total, item) => total + (item.cost * item.quantity),
        0
      );
      this.orderSummary.tax = this.orderSummary.subtotal * 0.20;
      this.orderSummary.total = this.orderSummary.subtotal + this.orderSummary.tax;
      
      this.paymentForm.patchValue({
        amount: this.orderSummary.total
      });
    }
  }

  async onSubmit() {
    if (this.paymentForm.invalid) {
      return;
    }
    
    this.checkUserLogin();
  
    this.loading = true;
    try {
      const { email, name } = this.paymentForm.value;
      const amount = Math.round(this.orderSummary.total * 100); // Convert to cents
  
      const clientSecret = await this.paymentService.createPaymentIntent(amount);
  
      const result = await this.paymentService.handleCardPayment(clientSecret, {
        payment_method_data: {
          billing_details: {
            name: name,
            email: email
          }
        }
      });
  
      if (result.success) {
        await this.travelService.clearCart();
        this.router.navigate(['/booking-confirmation'], {
          queryParams: {
            bookingId: this.bookingDetails.bookingId,
            amount: this.orderSummary.total,
            status: 'success'
          }
        });
      } else {
        this.cardError = result.error || 'Payment failed';
      }
    } catch (error) {
      console.error('Payment error:', error);
      this.cardError = 'An error occurred while processing your payment';
    } finally {
      this.loading = false;
    }
  }
  
  private checkUserLogin(): void {
    if (this.authservice.isLoggedIn()) {
      console.log('User is logged in, proceeding with payment...');
    } else {
      console.error('User is not logged in!');
      alert('You must be logged in to proceed with the payment.');
      this.router.navigate(['/login']);
      throw new Error('User not logged in');
    }
  }
}