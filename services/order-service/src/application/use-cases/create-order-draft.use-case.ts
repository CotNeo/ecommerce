import { OrderRepository } from '../ports/order.repository';
import { OrderStatus } from '@ecommerce/shared-kernel';

/**
 * Create order draft use case
 */
export class CreateOrderDraftUseCase {
  constructor(
    private orderRepository: OrderRepository = new (require('../../infrastructure/persistence/order.repository').OrderRepositoryImpl)()
  ) {}

  async execute(input: {
    userId: string;
    cartId?: string;
    shippingAddressId: string;
    billingAddressId?: string;
  }) {
    // 1. Get cart from Cart Service
    // TODO: Call Cart Service to get cart items

    // 2. Validate products and stock from Catalog Service
    // TODO: Call Catalog Service to validate products and stock

    // 3. Create order with PENDING_PAYMENT status
    return this.orderRepository.create({
      userId: input.userId,
      status: OrderStatus.PENDING_PAYMENT,
      shippingAddressId: input.shippingAddressId,
      billingAddressId: input.billingAddressId,
      items: [], // TODO: Get from cart
      totalAmount: 0, // TODO: Calculate from cart
    });
  }
}

