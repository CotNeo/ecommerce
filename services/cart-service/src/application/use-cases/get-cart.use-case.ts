import { CartRepository } from '../ports/cart.repository';

/**
 * Get cart use case
 */
export class GetCartUseCase {
  constructor(
    private cartRepository: CartRepository = new (require('../../infrastructure/persistence/cart.repository').CartRepositoryImpl)()
  ) {}

  async execute(input: { userId?: string; sessionId?: string }) {
    if (input.userId) {
      return this.cartRepository.findByUserId(input.userId);
    }
    if (input.sessionId) {
      return this.cartRepository.findBySessionId(input.sessionId);
    }
    // Create new cart if neither exists
    return this.cartRepository.create({ userId: input.userId, sessionId: input.sessionId });
  }
}

