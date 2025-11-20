import { PaymentProvider } from '../ports/payment-provider';
import { PaymentRepository } from '../ports/payment.repository';

/**
 * Create payment intent use case
 */
export class CreatePaymentIntentUseCase {
  constructor(
    private paymentProvider: PaymentProvider = new (require('../../infrastructure/payment-provider').StripePaymentProvider)(),
    private paymentRepository: PaymentRepository = new (require('../../infrastructure/persistence/payment.repository').PaymentRepositoryImpl)()
  ) {}

  async execute(input: { orderId: string; amount: number; currency: string }) {
    // 1. Create payment intent with provider (Stripe/Iyzico)
    const providerResult = await this.paymentProvider.createIntent({
      amount: input.amount,
      currency: input.currency,
      orderId: input.orderId,
    });

    // 2. Save payment intent to database
    const paymentIntent = await this.paymentRepository.create({
      orderId: input.orderId,
      amount: input.amount,
      currency: input.currency,
      providerIntentId: providerResult.intentId,
      status: 'PENDING',
    });

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: providerResult.clientSecret,
      payUrl: providerResult.payUrl,
    };
  }
}

