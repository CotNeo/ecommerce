import { CartRepository } from '../ports/cart.repository';

/**
 * Update cart item use case
 */
export class UpdateCartItemUseCase {
  constructor(
    private cartRepository: CartRepository = new (require('../../infrastructure/persistence/cart.repository').CartRepositoryImpl)()
  ) {}

  async execute(input: {
    userId?: string;
    sessionId?: string;
    itemId: string;
    quantity: number;
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

    // 2. Update item
    return this.cartRepository.updateItem(cart.id, input.itemId, input.quantity);
  }
}

