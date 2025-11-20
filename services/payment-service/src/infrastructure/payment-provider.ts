import { PaymentProvider } from '../application/ports/payment-provider';

/**
 * Stripe payment provider implementation
 * TODO: Implement actual Stripe integration
 */
export class StripePaymentProvider implements PaymentProvider {
  async createIntent(input: { amount: number; currency: string; orderId: string }): Promise<{
    intentId: string;
    clientSecret?: string;
    payUrl?: string;
  }> {
    // Mock implementation
    return {
      intentId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientSecret: `pi_secret_${Math.random().toString(36).substr(2, 20)}`,
    };
  }
}

