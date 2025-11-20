import { OrderRepository } from '../ports/order.repository';
import { OrderStatus } from '@ecommerce/shared-kernel';

/**
 * Mark order paid use case
 */
export class MarkOrderPaidUseCase {
  constructor(
    private orderRepository: OrderRepository = new (require('../../infrastructure/persistence/order.repository').OrderRepositoryImpl)()
  ) {}

  async execute(orderId: string) {
    // 1. Get order
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // 2. Update status to PAID
    // TODO: Decrease stock in Catalog Service
    // TODO: Publish event to Notification Service

    return this.orderRepository.updateStatus(orderId, OrderStatus.PAID);
  }
}

