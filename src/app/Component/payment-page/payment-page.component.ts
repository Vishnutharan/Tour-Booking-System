import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/Interface/travel.interface';
import { PaymentService } from 'src/app/Service/payment.service';
import { TravelService } from 'src/app/Service/travel.service';

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
 
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private travelService: TravelService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      cardComplete: [false, Validators.requiredTrue],
      amount: [0]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.setupCardElement();
  }

  ngOnDestroy(): void {
    this.paymentService.unmountCardElement();
  }

  // Ensures the Stripe Card Element is mounted. It also adds a listener for card errors or validation updates.
  private setupCardElement(): void {
    // Ensure the element is only mounted once
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

  //  Loads the cart items to display a summary on the payment page.
  private loadCartItems(): void {
    this.travelService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  // Same as the cart file – calculates totals for display and payment processing.
  private calculateTotals(): void {
    this.orderSummary.subtotal = this.cartItems.reduce(
      (total, item) => total + (item.cost * item.quantity),
      0
    );
    this.orderSummary.tax = this.orderSummary.subtotal * 0.20;
    this.orderSummary.total = this.orderSummary.subtotal + this.orderSummary.tax;
    
    // Update the amount in the form
    this.paymentForm.patchValue({
      amount: this.orderSummary.total
    });
  }

  // Handles the payment process
  // Validates the form.
  async onSubmit() {
    if (this.paymentForm.invalid) {
      return;
    }
    this.loading = true;
    try {
      const { email, name } = this.paymentForm.value;
      const amount = Math.round(this.orderSummary.total * 100); // Convert to cents

      // Calls createPaymentIntent to get the clientSecret.
      const clientSecret = await this.paymentService.createPaymentIntent(amount);

      // Calls handleCardPayment to finalize the payment.
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
        this.router.navigate(['/booking-confirmation']);
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
}