import { CartRepository as ICartRepository } from '../../application/ports/cart.repository';
import { Cart, CartItem } from '@ecommerce/shared-kernel';
import { getPrismaClient } from './prisma-client';

/**
 * Cart repository implementation with Prisma
 */
export class CartRepositoryImpl implements ICartRepository {
  private prisma = getPrismaClient();

  /**
   * Find cart by ID
   */
  async findById(id: string): Promise<Cart | null> {
    console.log('[CartRepository] Finding cart by ID:', id);
    try {
      const cartData = await (this.prisma as any).cart.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!cartData) {
        console.log('[CartRepository] Cart not found:', id);
        return null;
      }

      return this.mapToDomain(cartData);
    } catch (error) {
      console.error('[CartRepository] Error finding cart by ID:', error);
      throw error;
    }
  }

  /**
   * Find cart by user ID
   */
  async findByUserId(userId: string): Promise<Cart | null> {
    console.log('[CartRepository] Finding cart by user ID:', userId);
    try {
      const cartData = await (this.prisma as any).cart.findFirst({
        where: { userId },
        include: {
          items: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      if (!cartData) {
        console.log('[CartRepository] Cart not found for user:', userId);
        return null;
      }

      return this.mapToDomain(cartData);
    } catch (error) {
      console.error('[CartRepository] Error finding cart by user ID:', error);
      throw error;
    }
  }

  /**
   * Find cart by session ID
   */
  async findBySessionId(sessionId: string): Promise<Cart | null> {
    console.log('[CartRepository] Finding cart by session ID:', sessionId);
    try {
      const cartData = await (this.prisma as any).cart.findFirst({
        where: { sessionId },
        include: {
          items: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      if (!cartData) {
        console.log('[CartRepository] Cart not found for session:', sessionId);
        return null;
      }

      return this.mapToDomain(cartData);
    } catch (error) {
      console.error('[CartRepository] Error finding cart by session ID:', error);
      throw error;
    }
  }

  /**
   * Create new cart
   */
  async create(data: { userId?: string; sessionId?: string }): Promise<Cart> {
    console.log('[CartRepository] Creating cart', { userId: data.userId, sessionId: data.sessionId });
    try {
      const cartData = await (this.prisma as any).cart.create({
        data: {
          userId: data.userId,
          sessionId: data.sessionId,
          totalAmount: 0,
          currency: 'TRY',
        },
        include: {
          items: true,
        },
      });

      console.log('[CartRepository] Cart created successfully:', cartData.id);
      return this.mapToDomain(cartData);
    } catch (error) {
      console.error('[CartRepository] Error creating cart:', error);
      throw error;
    }
  }

  /**
   * Add item to cart
   * Note: This is a simplified implementation. In production, you should:
   * 1. Fetch product price from Catalog Service
   * 2. Handle variant pricing
   * 3. Update cart total amount
   */
  async addItem(
    cartId: string,
    item: { productId: string; variantId?: string; quantity: number }
  ): Promise<Cart> {
    console.log('[CartRepository] Adding item to cart', { cartId, item });
    try {
      // Check if cart exists
      const cart = await (this.prisma as any).cart.findUnique({
        where: { id: cartId },
      });

      if (!cart) {
        throw new Error('Cart not found');
      }

      // TODO: Fetch product price from Catalog Service
      // For now, use a default price
      const unitPrice = 0; // Should be fetched from Catalog Service
      const totalPrice = unitPrice * item.quantity;

      // Check if item already exists in cart
      const existingItem = await (this.prisma as any).cartItem.findFirst({
        where: {
          cartId,
          productId: item.productId,
          variantId: item.variantId || null,
        },
      });

      let cartItem;
      if (existingItem) {
        // Update existing item quantity
        cartItem = await (this.prisma as any).cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + item.quantity,
            totalPrice: (existingItem.quantity + item.quantity) * unitPrice,
            updatedAt: new Date(),
          },
        });
        console.log('[CartRepository] Cart item updated:', cartItem.id);
      } else {
        // Create new cart item
        cartItem = await (this.prisma as any).cartItem.create({
          data: {
            cartId,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice,
            totalPrice,
          },
        });
        console.log('[CartRepository] Cart item created:', cartItem.id);
      }

      // Recalculate cart total
      const allItems = await (this.prisma as any).cartItem.findMany({
        where: { cartId },
      });

      const newTotalAmount = allItems.reduce((sum: number, item: any) => {
        return sum + Number(item.totalPrice);
      }, 0);

      // Update cart total
      const updatedCart = await (this.prisma as any).cart.update({
        where: { id: cartId },
        data: {
          totalAmount: newTotalAmount,
          updatedAt: new Date(),
        },
        include: {
          items: true,
        },
      });

      console.log('[CartRepository] Cart updated successfully:', updatedCart.id);
      return this.mapToDomain(updatedCart);
    } catch (error) {
      console.error('[CartRepository] Error adding item to cart:', error);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   */
  async updateItem(cartId: string, itemId: string, quantity: number): Promise<Cart> {
    console.log('[CartRepository] Updating cart item', { cartId, itemId, quantity });
    try {
      // Check if cart exists
      const cart = await (this.prisma as any).cart.findUnique({
        where: { id: cartId },
      });

      if (!cart) {
        throw new Error('Cart not found');
      }

      // Get existing item
      const existingItem = await (this.prisma as any).cartItem.findUnique({
        where: { id: itemId },
      });

      if (!existingItem || existingItem.cartId !== cartId) {
        throw new Error('Cart item not found');
      }

      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      // Update item quantity
      const unitPrice = Number(existingItem.unitPrice);
      const totalPrice = unitPrice * quantity;

      await (this.prisma as any).cartItem.update({
        where: { id: itemId },
        data: {
          quantity,
          totalPrice,
          updatedAt: new Date(),
        },
      });

      // Recalculate cart total
      const allItems = await (this.prisma as any).cartItem.findMany({
        where: { cartId },
      });

      const newTotalAmount = allItems.reduce((sum: number, item: any) => {
        return sum + Number(item.totalPrice);
      }, 0);

      // Update cart total
      const updatedCart = await (this.prisma as any).cart.update({
        where: { id: cartId },
        data: {
          totalAmount: newTotalAmount,
          updatedAt: new Date(),
        },
        include: {
          items: true,
        },
      });

      console.log('[CartRepository] Cart item updated successfully:', itemId);
      return this.mapToDomain(updatedCart);
    } catch (error) {
      console.error('[CartRepository] Error updating cart item:', error);
      throw error;
    }
  }

  /**
   * Remove item from cart
   */
  async removeItem(cartId: string, itemId: string): Promise<Cart> {
    console.log('[CartRepository] Removing cart item', { cartId, itemId });
    try {
      // Check if cart exists
      const cart = await (this.prisma as any).cart.findUnique({
        where: { id: cartId },
      });

      if (!cart) {
        throw new Error('Cart not found');
      }

      // Check if item exists and belongs to cart
      const existingItem = await (this.prisma as any).cartItem.findUnique({
        where: { id: itemId },
      });

      if (!existingItem || existingItem.cartId !== cartId) {
        throw new Error('Cart item not found');
      }

      // Delete item
      await (this.prisma as any).cartItem.delete({
        where: { id: itemId },
      });

      // Recalculate cart total
      const allItems = await (this.prisma as any).cartItem.findMany({
        where: { cartId },
      });

      const newTotalAmount = allItems.reduce((sum: number, item: any) => {
        return sum + Number(item.totalPrice);
      }, 0);

      // Update cart total
      const updatedCart = await (this.prisma as any).cart.update({
        where: { id: cartId },
        data: {
          totalAmount: newTotalAmount,
          updatedAt: new Date(),
        },
        include: {
          items: true,
        },
      });

      console.log('[CartRepository] Cart item removed successfully:', itemId);
      return this.mapToDomain(updatedCart);
    } catch (error) {
      console.error('[CartRepository] Error removing cart item:', error);
      throw error;
    }
  }

  /**
   * Map Prisma model to domain entity
   */
  private mapToDomain(cartData: {
    id: string;
    userId: string | null;
    sessionId: string | null;
    totalAmount: any; // Decimal
    currency: string;
    createdAt: Date;
    updatedAt: Date;
    items: Array<{
      id: string;
      cartId: string;
      productId: string;
      variantId: string | null;
      quantity: number;
      unitPrice: any; // Decimal
      totalPrice: any; // Decimal
      createdAt: Date;
      updatedAt: Date;
    }>;
  }): Cart {
    return {
      id: cartData.id,
      userId: cartData.userId || undefined,
      sessionId: cartData.sessionId || undefined,
      items: cartData.items.map((item) => this.mapItemToDomain(item)),
      totalAmount: Number(cartData.totalAmount),
      createdAt: cartData.createdAt,
      updatedAt: cartData.updatedAt,
    };
  }

  /**
   * Map CartItem Prisma model to domain entity
   */
  private mapItemToDomain(itemData: {
    id: string;
    cartId: string;
    productId: string;
    variantId: string | null;
    quantity: number;
    unitPrice: any; // Decimal
    totalPrice: any; // Decimal
  }): CartItem {
    return {
      id: itemData.id,
      cartId: itemData.cartId,
      productId: itemData.productId,
      variantId: itemData.variantId || undefined,
      quantity: itemData.quantity,
      unitPrice: Number(itemData.unitPrice),
      totalPrice: Number(itemData.totalPrice),
    };
  }
}

