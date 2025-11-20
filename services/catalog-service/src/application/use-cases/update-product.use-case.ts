import { ProductRepository } from '../ports/product.repository';

/**
 * Update product use case
 */
export class UpdateProductUseCase {
  constructor(
    private productRepository: ProductRepository = new (require('../../infrastructure/persistence/product.repository').ProductRepositoryImpl)()
  ) {}

  async execute(id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    currency?: string;
    sku?: string;
    image?: string;
    images?: string[];
    categoryId?: string;
    brandId?: string;
    isActive?: boolean;
  }) {
    return this.productRepository.update(id, data);
  }
}

