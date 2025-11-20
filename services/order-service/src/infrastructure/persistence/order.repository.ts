import { OrderRepository as IOrderRepository } from '../../application/ports/order.repository';
import { Order, OrderStatus, OrderItem, Address } from '@ecommerce/shared-kernel';
import { getPrismaClient } from './prisma-client';

/**
 * Order repository implementation with Prisma
 */
export class OrderRepositoryImpl implements IOrderRepository {
  private prisma = getPrismaClient();

  /**
   * Find order by ID
   */
  async findById(id: string): Promise<Order | null> {
    console.log('[OrderRepository] Finding order by ID:', id);
    try {
      const orderData = await (this.prisma as any).order.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!orderData) {
        console.log('[OrderRepository] Order not found:', id);
        return null;
      }

      return this.mapToDomain(orderData);
    } catch (error) {
      console.error('[OrderRepository] Error finding order by ID:', error);
      throw error;
    }
  }

  /**
   * Find orders by user ID
   */
  async findByUserId(userId: string): Promise<Order[]> {
    console.log('[OrderRepository] Finding orders by user ID:', userId);
    try {
      const orders = await (this.prisma as any).order.findMany({
        where: { userId },
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log('[OrderRepository] Found orders:', orders.length);
      return orders.map((order: any) => this.mapToDomain(order));
    } catch (error) {
      console.error('[OrderRepository] Error finding orders by user ID:', error);
      throw error;
    }
  }

  /**
   * Find all orders (for admin)
   */
  async findAll(): Promise<Order[]> {
    console.log('[OrderRepository] Finding all orders');
    try {
      const orders = await (this.prisma as any).order.findMany({
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log('[OrderRepository] Found orders:', orders.length);
      return orders.map((order: any) => this.mapToDomain(order));
    } catch (error) {
      console.error('[OrderRepository] Error finding all orders:', error);
      throw error;
    }
  }

  /**
   * Create new order
   * Note: shippingAddressId and billingAddressId are converted to JSON addresses
   */
  async create(data: {
    userId: string;
    status: OrderStatus;
    shippingAddressId: string;
    billingAddressId?: string;
    items: any[];
    totalAmount: number;
  }): Promise<Order> {
    console.log('[OrderRepository] Creating order', { userId: data.userId, status: data.status });
    try {
      // TODO: Fetch addresses from Auth Service using shippingAddressId and billingAddressId
      // For now, create placeholder JSON addresses
      const shippingAddress: Address | null = data.shippingAddressId
        ? {
            id: data.shippingAddressId,
            userId: data.userId,
            firstName: '',
            lastName: '',
            addressLine1: '',
            city: '',
            postalCode: '',
            country: 'TR',
          }
        : null;

      const billingAddress: Address | null = data.billingAddressId
        ? {
            id: data.billingAddressId,
            userId: data.userId,
            firstName: '',
            lastName: '',
            addressLine1: '',
            city: '',
            postalCode: '',
            country: 'TR',
          }
        : null;

      // Create order with items in a transaction
      const orderData = await (this.prisma as any).$transaction(async (tx: any) => {
        // Create order
        const order = await (tx as any).order.create({
          data: {
            userId: data.userId,
            status: data.status,
            totalAmount: data.totalAmount,
            currency: 'TRY',
            shippingAddress: shippingAddress ? JSON.parse(JSON.stringify(shippingAddress)) : null,
            billingAddress: billingAddress ? JSON.parse(JSON.stringify(billingAddress)) : null,
            shippingCost: 0,
            taxAmount: 0,
            discountAmount: 0,
          },
        });

        // Create order items
        const orderItems = await Promise.all(
          data.items.map((item: any) =>
            (tx as any).orderItem.create({
              data: {
                orderId: order.id,
                productId: item.productId,
                variantId: item.variantId,
                sku: item.sku || `SKU-${item.productId}`,
                name: item.name || 'Product',
                quantity: item.quantity,
                unitPrice: item.unitPrice || 0,
                totalPrice: (item.unitPrice || 0) * item.quantity,
              },
            })
          )
        );

        // Create initial status history
        await (tx as any).orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: data.status,
            note: 'Order created',
          },
        });

        // Return order with items
        return await (tx as any).order.findUnique({
          where: { id: order.id },
          include: {
            items: true,
          },
        });
      });

      console.log('[OrderRepository] Order created successfully:', orderData.id);
      return this.mapToDomain(orderData);
    } catch (error) {
      console.error('[OrderRepository] Error creating order:', error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    console.log('[OrderRepository] Updating order status', { id, status });
    try {
      // Update order status
      const orderData = await (this.prisma as any).order.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date(),
        },
        include: {
          items: true,
        },
      });

      // Add status history entry
      await (this.prisma as any).orderStatusHistory.create({
        data: {
          orderId: id,
          status,
          note: `Status changed to ${status}`,
        },
      });

      console.log('[OrderRepository] Order status updated successfully:', id);
      return this.mapToDomain(orderData);
    } catch (error) {
      console.error('[OrderRepository] Error updating order status:', error);
      throw error;
    }
  }

  /**
   * Map Prisma model to domain entity
   */
  private mapToDomain(orderData: {
    id: string;
    userId: string;
    status: OrderStatus;
    totalAmount: any; // Decimal
    currency: string;
    shippingAddress: any; // JSON
    billingAddress: any; // JSON
    shippingCost: any; // Decimal
    taxAmount: any; // Decimal
    discountAmount: any; // Decimal
    createdAt: Date;
    updatedAt: Date;
    items: Array<{
      id: string;
      orderId: string;
      productId: string;
      variantId: string | null;
      sku: string;
      name: string;
      quantity: number;
      unitPrice: any; // Decimal
      totalPrice: any; // Decimal
      createdAt: Date;
    }>;
  }): Order {
    return {
      id: orderData.id,
      userId: orderData.userId,
      status: orderData.status,
      totalAmount: Number(orderData.totalAmount),
      currency: orderData.currency,
      items: orderData.items.map((item) => this.mapItemToDomain(item)),
      shippingAddress: orderData.shippingAddress
        ? (orderData.shippingAddress as Address)
        : undefined,
      billingAddress: orderData.billingAddress ? (orderData.billingAddress as Address) : undefined,
      createdAt: orderData.createdAt,
      updatedAt: orderData.updatedAt,
    };
  }

  /**
   * Map OrderItem Prisma model to domain entity
   */
  private mapItemToDomain(itemData: {
    id: string;
    orderId: string;
    productId: string;
    variantId: string | null;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: any; // Decimal
    totalPrice: any; // Decimal
  }): OrderItem {
    return {
      id: itemData.id,
      orderId: itemData.orderId,
      productId: itemData.productId,
      variantId: itemData.variantId || undefined,
      quantity: itemData.quantity,
      unitPrice: Number(itemData.unitPrice),
      totalPrice: Number(itemData.totalPrice),
    };
  }
}

