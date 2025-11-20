/**
 * Payment repository interface (port)
 */
export interface PaymentRepository {
  create(data: {
    orderId: string;
    amount: number;
    currency: string;
    providerIntentId: string;
    status: string;
  }): Promise<{ id: string; orderId: string }>;
  findByProviderIntentId(providerIntentId: string): Promise<{ id: string; orderId: string } | null>;
  updateStatus(id: string, status: string): Promise<void>;
}

