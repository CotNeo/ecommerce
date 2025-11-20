import { CartRepository } from '../ports/cart.repository';

/**
 * Add to cart use case
 */
export class AddToCartUseCase {
  constructor(
    private cartRepository: CartRepository = new (require('../../infrastructure/persistence/cart.repository').CartRepositoryImpl)()
  ) {}

  async execute(input: {
    userId?: string;
    sessionId?: string;
    productId: string;
    variantId?: string;
    quantity: number;
  }) {
    // 1. Get or create cart
    let cart;
    if (input.userId) {
      cart = await this.cartRepository.findByUserId(input.userId);
    } else if (input.sessionId) {
      cart = await this.cartRepository.findBySessionId(input.sessionId);
    }

    if (!cart) {
      cart = await this.cartRepository.create({ userId: input.userId, sessionId: input.sessionId });
    }

    // 2. Add item to cart
    // TODO: Validate product exists via Catalog Service
    // TODO: Calculate prices
    return this.cartRepository.addItem(cart.id, {
      productId: input.productId,
      variantId: input.variantId,
      quantity: input.quantity,
    });
  }
}

