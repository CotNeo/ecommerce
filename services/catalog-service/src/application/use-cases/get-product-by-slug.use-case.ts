import { ProductRepository } from '../ports/product.repository';

/**
 * Get product by slug use case
 */
export class GetProductBySlugUseCase {
  constructor(
    private productRepository: ProductRepository = new (require('../../infrastructure/persistence/product.repository').ProductRepositoryImpl)()
  ) {}

  async execute(slug: string) {
    return this.productRepository.findBySlug(slug);
  }
}

