import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { environment } from '../Environment/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;
  private elementMounted = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initStripe();
  }

  ngOnDestroy() {
    this.unmountCardElement();
  }

  private async initStripe() {
    try {
      const stripePublicKey = environment.stripe?.publicKey;

      if (!stripePublicKey) {
        throw new Error('Stripe public key is not defined');
      }

      this.stripe = await loadStripe(stripePublicKey);

      if (this.stripe) {
        this.elements = this.stripe.elements();
      } else {
        throw new Error('Failed to load Stripe');
      }
    } catch (error) {
      console.error('Stripe initialization error:', error);
    }
  }

  mountCardElement(elementId: string): StripeCardElement | null {
    if (!this.elements) {
      console.error('Stripe elements not initialized');
      return null;
    }

    try {
      // If card element exists and is mounted, return it
      if (this.cardElement && this.elementMounted.value) {
        return this.cardElement;
      }

      // If card element exists but not mounted, unmount it first
      if (this.cardElement) {
        this.unmountCardElement();
      }

      // Get container element
      const cardElementContainer = document.getElementById(elementId);
      if (!cardElementContainer) {
        throw new Error(`Card element container with ID ${elementId} not found`);
      }

      // Create new card element
      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#dc3545',
            iconColor: '#dc3545'
          }
        }
      });

      // Mount the card element
      this.cardElement.mount(cardElementContainer);
      this.elementMounted.next(true);

      // Add unmount listener
      cardElementContainer.addEventListener('DOMNodeRemoved', () => {
        this.unmountCardElement();
      });

      return this.cardElement;
    } catch (error) {
      console.error('Error mounting card element:', error);
      return null;
    }
  }

  unmountCardElement(): void {
    if (this.cardElement && this.elementMounted.value) {
      try {
        this.cardElement.unmount();
        this.elementMounted.next(false);
      } catch (error) {
        console.error('Error unmounting card element:', error);
      } finally {
        this.cardElement = null;
      }
    }
  }

  isElementMounted(): boolean {
    return this.elementMounted.value;
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
          currency: 'gbp'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      if (!data.clientSecret) {
        throw new Error('No client secret received');
      }

      return data.clientSecret;
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw error;
    }
  }

  async handleCardPayment(clientSecret: string, data?: any): Promise<any> {
    if (!this.stripe || !this.cardElement) {
      throw new Error('Stripe not fully initialized');
    }

    try {
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: data?.payment_method_data?.billing_details || {}
        }
      });

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      if (result.paymentIntent?.status === 'succeeded') {
        return { success: true, paymentIntent: result.paymentIntent };
      }

      return { success: false, error: 'Payment not completed' };
    } catch (error) {
      console.error('Card payment processing error:', error);
      return { success: false, error: 'Payment processing failed' };
    }
  }
}