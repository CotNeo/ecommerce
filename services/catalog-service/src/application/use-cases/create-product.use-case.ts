import { ProductRepository } from '../ports/product.repository';

/**
 * Create product use case
 */
export class CreateProductUseCase {
  constructor(
    private productRepository: ProductRepository = new (require('../../infrastructure/persistence/product.repository').ProductRepositoryImpl)()
  ) {}

  async execute(data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    currency?: string;
    sku?: string;
    image?: string;
    images?: string[];
    categoryId?: string;
    brandId?: string;
  }) {
    return this.productRepository.create(data);
  }
}

