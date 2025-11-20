/**
 * Payment provider interface (port)
 */
export interface PaymentProvider {
  createIntent(input: { amount: number; currency: string; orderId: string }): Promise<{
    intentId: string;
    clientSecret?: string;
    payUrl?: string;
  }>;
}

