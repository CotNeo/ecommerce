import { ProductRepository } from '../ports/product.repository';

/**
 * Delete product use case
 */
export class DeleteProductUseCase {
  constructor(
    private productRepository: ProductRepository = new (require('../../infrastructure/persistence/product.repository').ProductRepositoryImpl)()
  ) {}

  async execute(id: string) {
    return this.productRepository.delete(id);
  }
}

