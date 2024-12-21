import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/Service/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

// export class PaymentComponent implements OnInit,AfterViewInit  {
  // paymentForm: FormGroup;
  // loading = false;

  // constructor(
  //   private fb: FormBuilder,
  //   private paymentService: PaymentService
  // ) {
  //   this.paymentForm = this.fb.group({
  //     amount: ['', [Validators.required, Validators.min(1)]]
  //   });
  // }

  // ngOnInit(): void {
  //   // Form initialization logic
  // }

  // ngAfterViewInit(): void {
  //   // Mount card element after view is fully initialized
  //   setTimeout(() => {
  //     this.paymentService.mountCardElement('card-element');
  //   });
  // }

  // async onSubmit() {
  //   if (this.paymentForm.invalid) return;

  //   this.loading = true;

  //   try {
  //     const { amount } = this.paymentForm.value;
      
  //     // Create Payment Intent
  //     const clientSecret = await this.paymentService.createPaymentIntent(amount);
      
  //     // Confirm Card Payment
  //     const result = await this.paymentService.handleCardPayment(clientSecret);
      
  //     if (result.success) {
  //       alert('Payment successful!');
  //       // Handle successful payment (e.g., reset form, navigate, etc.)
  //     } else {
  //       alert(`Payment failed: ${result.error}`);
  //     }
  //   } catch (error) {
  //     console.error('Payment error', error);
  //     alert('Payment failed');
  //   } finally {
  //     this.loading = false;
  //   }
  // }
}