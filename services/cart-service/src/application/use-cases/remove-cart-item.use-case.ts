import { CartRepository } from '../ports/cart.repository';

/**
 * Remove cart item use case
 */
export class RemoveCartItemUseCase {
  constructor(
    private cartRepository: CartRepository = new (require('../../infrastructure/persistence/cart.repository').CartRepositoryImpl)()
  ) {}

  async execute(input: {
    userId?: string;
    sessionId?: string;
    itemId: string;
  }) {
    // 1. Get cart
    let cart;
    if (input.userId) {
      cart = await this.cartRepository.findByUserId(input.userId);
    } else if (input.sessionId) {
      cart = await this.cartRepository.findBySessionId(input.sessionId);
    }

    if (!cart) {
      throw new Error('Cart not found');
    }

    // 2. Remove item
    return this.cartRepository.removeItem(cart.id, input.itemId);
  }
}

