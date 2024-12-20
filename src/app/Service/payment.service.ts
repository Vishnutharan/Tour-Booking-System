import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { environment } from '../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  constructor() {
    this.initStripe();
  }

  private async initStripe() {
    try {
      const stripePublicKey = environment.stripe?.publicKey;
      
      if (!stripePublicKey) {
        console.error('Stripe public key is not defined');
        return;
      }

      this.stripe = await loadStripe(stripePublicKey);
      
      if (this.stripe) {
        this.elements = this.stripe.elements();
        console.log('Stripe initialized successfully');
      } else {
        console.error('Failed to load Stripe');
      }
    } catch (error) {
      console.error('Stripe initialization error', error);
    }
  }

  mountCardElement(elementId: string): StripeCardElement | null {
    if (!this.elements) {
      console.error('Stripe elements not initialized');
      return null;
    }

    try {
      this.cardElement = this.elements.create('card');
      
      const cardElementContainer = document.getElementById(elementId);
      if (cardElementContainer) {
        this.cardElement.mount(cardElementContainer);
        return this.cardElement;
      } else {
        console.error(`Card element container with ID ${elementId} not found`);
        return null;
      }
    } catch (error) {
      console.error('Error mounting card element', error);
      return null;
    }
  }

  async createPaymentIntent(amount: number): Promise<string> {
    try {
      const response = await fetch('https://localhost:7140/api/Payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'usd'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (!responseData.clientSecret) {
        throw new Error('No client secret received');
      }

      return responseData.clientSecret;
    } catch (error) {
      console.error('Payment intent creation failed', error);
      throw error;
    }
  }

  async handleCardPayment(clientSecret: string): Promise<any> {
    if (!this.stripe || !this.cardElement) {
      console.error('Stripe not fully initialized');
      return { success: false, error: 'Stripe not initialized' };
    }

    try {
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {}
        }
      });

      if (result.error) {
        console.error('Payment confirmation error:', result.error);
        return { success: false, error: result.error.message };
      }

      if (result.paymentIntent?.status === 'succeeded') {
        return { success: true, paymentIntent: result.paymentIntent };
      }

      return { success: false, error: 'Payment not completed' };
    } catch (error) {
      console.error('Card payment processing error', error);
      return { success: false, error: 'Payment processing failed' };
    }
  }
}