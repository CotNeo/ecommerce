import { Cart } from '@ecommerce/shared-kernel';

/**
 * Cart repository interface (port)
 */
export interface CartRepository {
  findById(id: string): Promise<Cart | null>;
  findByUserId(userId: string): Promise<Cart | null>;
  findBySessionId(sessionId: string): Promise<Cart | null>;
  create(data: { userId?: string; sessionId?: string }): Promise<Cart>;
  addItem(cartId: string, item: { productId: string; variantId?: string; quantity: number }): Promise<Cart>;
  updateItem(cartId: string, itemId: string, quantity: number): Promise<Cart>;
  removeItem(cartId: string, itemId: string): Promise<Cart>;
}

