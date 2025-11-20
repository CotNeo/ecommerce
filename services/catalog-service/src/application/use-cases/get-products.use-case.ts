import { ProductRepository } from '../ports/product.repository';

/**
 * Get products use case
 */
export class GetProductsUseCase {
  constructor(
    private productRepository: ProductRepository = new (require('../../infrastructure/persistence/product.repository').ProductRepositoryImpl)()
  ) {}

  async execute(input: {
    categoryId?: string;
    limit?: number;
    offset?: number;
  }) {
    return this.productRepository.findAll({
      categoryId: input.categoryId,
      limit: input.limit || 20,
      offset: input.offset || 0,
    });
  }
}

