import { Product } from '@ecommerce/shared-kernel';

/**
 * Product repository interface (port)
 */
export interface ProductRepository {
  findAll(options: { categoryId?: string; limit: number; offset: number }): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  create(data: {
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
  }): Promise<Product>;
  update(id: string, data: {
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
  }): Promise<Product>;
  delete(id: string): Promise<void>;
}

