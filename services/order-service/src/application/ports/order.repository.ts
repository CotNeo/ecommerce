import { Order, OrderStatus } from '@ecommerce/shared-kernel';

/**
 * Order repository interface (port)
 */
export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  create(data: {
    userId: string;
    status: OrderStatus;
    shippingAddressId: string;
    billingAddressId?: string;
    items: any[];
    totalAmount: number;
  }): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
}

