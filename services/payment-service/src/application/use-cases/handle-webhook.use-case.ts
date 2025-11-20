import { PaymentRepository } from '../ports/payment.repository';

/**
 * Handle webhook use case
 */
export class HandleWebhookUseCase {
  constructor(
    private paymentRepository: PaymentRepository = new (require('../../infrastructure/persistence/payment.repository').PaymentRepositoryImpl)()
  ) {}

  async execute(webhookData: any) {
    // 1. Verify webhook signature (security)
    // TODO: Verify signature from payment provider

    // 2. Update payment status
    const paymentIntent = await this.paymentRepository.findByProviderIntentId(webhookData.intentId);
    if (!paymentIntent) {
      throw new Error('Payment intent not found');
    }

    await this.paymentRepository.updateStatus(paymentIntent.id, webhookData.status);

    // 3. Notify Order Service if payment succeeded
    if (webhookData.status === 'SUCCEEDED') {
      // TODO: Call Order Service to mark order as paid
      const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3004';
      await fetch(`${orderServiceUrl}/api/v1/orders/${paymentIntent.orderId}/mark-paid`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return { success: true };
  }
}

