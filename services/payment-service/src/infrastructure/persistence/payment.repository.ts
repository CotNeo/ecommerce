import { PaymentRepository as IPaymentRepository } from '../../application/ports/payment.repository';
import { getPrismaClient } from './prisma-client';

/**
 * Payment repository implementation with Prisma
 */
export class PaymentRepositoryImpl implements IPaymentRepository {
  private prisma = getPrismaClient();

  /**
   * Create payment intent
   */
  async create(data: {
    orderId: string;
    amount: number;
    currency: string;
    providerIntentId: string;
    status: string;
  }): Promise<{ id: string; orderId: string }> {
    console.log('[PaymentRepository] Creating payment intent', { orderId: data.orderId });
    try {
      const paymentIntent = await (this.prisma as any).paymentIntent.create({
        data: {
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency,
          provider: 'stripe', // Default provider, can be made configurable
          providerIntentId: data.providerIntentId,
          status: data.status,
        },
      });

      // Create initial log
      await (this.prisma as any).paymentLog.create({
        data: {
          paymentIntentId: paymentIntent.id,
          event: 'created',
          message: 'Payment intent created',
          metadata: {
            providerIntentId: data.providerIntentId,
          },
        },
      });

      console.log('[PaymentRepository] Payment intent created successfully:', paymentIntent.id);
      return { id: paymentIntent.id, orderId: paymentIntent.orderId };
    } catch (error) {
      console.error('[PaymentRepository] Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Find payment intent by provider intent ID
   */
  async findByProviderIntentId(providerIntentId: string): Promise<{ id: string; orderId: string } | null> {
    console.log('[PaymentRepository] Finding payment intent by provider intent ID:', providerIntentId);
    try {
      const paymentIntent = await (this.prisma as any).paymentIntent.findFirst({
        where: { providerIntentId },
      });

      if (!paymentIntent) {
        console.log('[PaymentRepository] Payment intent not found:', providerIntentId);
        return null;
      }

      return { id: paymentIntent.id, orderId: paymentIntent.orderId };
    } catch (error) {
      console.error('[PaymentRepository] Error finding payment intent:', error);
      throw error;
    }
  }

  /**
   * Update payment intent status
   */
  async updateStatus(id: string, status: string): Promise<void> {
    console.log('[PaymentRepository] Updating payment intent status', { id, status });
    try {
      await (this.prisma as any).paymentIntent.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date(),
        },
      });

      // Create log entry
      await (this.prisma as any).paymentLog.create({
        data: {
          paymentIntentId: id,
          event: status.toLowerCase(),
          message: `Payment status changed to ${status}`,
          metadata: {
            status,
          },
        },
      });

      console.log('[PaymentRepository] Payment intent status updated successfully:', id);
    } catch (error) {
      console.error('[PaymentRepository] Error updating payment intent status:', error);
      throw error;
    }
  }
}

