import { ProductRepository as IProductRepository } from '../../application/ports/product.repository';
import { Product } from '@ecommerce/shared-kernel';
import { getPrismaClient } from './prisma-client';

/**
 * Product repository implementation with Prisma
 */
export class ProductRepositoryImpl implements IProductRepository {
  private prisma = getPrismaClient();

  constructor() {
    // Ensure Prisma Client is initialized
    if (!this.prisma) {
      throw new Error('Prisma Client is not initialized');
    }
    
    // Debug: Log Prisma Client structure in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[ProductRepository] Prisma Client keys:', Object.keys(this.prisma));
      console.log('[ProductRepository] Has product property?', 'product' in this.prisma);
      if ((this.prisma as any).product) {
        console.log('[ProductRepository] ✅ Product model found');
      } else {
        console.error('[ProductRepository] ❌ Product model NOT found!');
        console.error('[ProductRepository] Available models:', Object.keys(this.prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
      }
    }
  }

  /**
   * Find all products with filters
   */
  async findAll(options: {
    categoryId?: string;
    limit: number;
    offset: number;
  }): Promise<Product[]> {
    console.log('[ProductRepository] Finding all products', { options });
    try {
      const where: any = {
        isActive: true,
      };

      if (options.categoryId) {
        where.categoryId = options.categoryId;
      }

      // Ensure product model exists
      if (!(this.prisma as any).product) {
        console.error('[ProductRepository] Product model not found in Prisma Client');
        console.error('[ProductRepository] Available models:', Object.keys(this.prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
        throw new Error('Product model not found in Prisma Client. Please run: npm run prisma:generate');
      }

      const products = await (this.prisma as any).product.findMany({
        where,
        take: options.limit,
        skip: options.offset,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: true,
          brand: true,
        },
      });

      console.log('[ProductRepository] Found products:', products.length);
      return products.map((p) => this.mapToDomain(p));
    } catch (error) {
      console.error('[ProductRepository] Error finding products:', error);
      throw error;
    }
  }

  /**
   * Find product by slug
   */
  async findBySlug(slug: string): Promise<Product | null> {
    console.log('[ProductRepository] Finding product by slug:', slug);
    try {
      const product = await (this.prisma as any).product.findUnique({
        where: { slug },
        include: {
          category: true,
          brand: true,
        },
      });

      if (!product) {
        console.log('[ProductRepository] Product not found:', slug);
        return null;
      }

      return this.mapToDomain(product);
    } catch (error) {
      console.error('[ProductRepository] Error finding product by slug:', error);
      throw error;
    }
  }

  /**
   * Find product by ID
   */
  async findById(id: string): Promise<Product | null> {
    console.log('[ProductRepository] Finding product by ID:', id);
    try {
      const product = await (this.prisma as any).product.findUnique({
        where: { id },
        include: {
          category: true,
          brand: true,
        },
      });

      if (!product) {
        console.log('[ProductRepository] Product not found:', id);
        return null;
      }

      return this.mapToDomain(product);
    } catch (error) {
      console.error('[ProductRepository] Error finding product by ID:', error);
      throw error;
    }
  }

  /**
   * Create product
   */
  async create(data: {
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
  }): Promise<Product> {
    console.log('[ProductRepository] Creating product', { name: data.name, slug: data.slug });
    try {
      // Debug: Check if prisma and product model exist
      if (!this.prisma) {
        throw new Error('Prisma Client is not initialized');
      }
      if (!(this.prisma as any).product) {
        console.error('[ProductRepository] Prisma Client structure:', Object.keys(this.prisma));
        throw new Error('Product model not found in Prisma Client');
      }

      const productData = await (this.prisma as any).product.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          currency: data.currency || 'TRY',
          sku: data.sku,
          image: data.image,
          images: data.images ? JSON.stringify(data.images) : null,
          categoryId: data.categoryId || null,
          brandId: data.brandId || null,
          isActive: true,
        },
      });

      console.log('[ProductRepository] Product created successfully:', productData.id);
      return this.mapToDomain(productData);
    } catch (error) {
      console.error('[ProductRepository] Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update product
   */
  async update(id: string, data: {
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
  }): Promise<Product> {
    console.log('[ProductRepository] Updating product', { id, data });
    try {
      const updateData: any = {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.currency && { currency: data.currency }),
        ...(data.sku && { sku: data.sku }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.images !== undefined && { images: data.images ? JSON.stringify(data.images) : null }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId || null }),
        ...(data.brandId !== undefined && { brandId: data.brandId || null }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      };

      const productData = await (this.prisma as any).product.update({
        where: { id },
        data: updateData,
      });

      console.log('[ProductRepository] Product updated successfully:', productData.id);
      return this.mapToDomain(productData);
    } catch (error) {
      console.error('[ProductRepository] Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete product (soft delete by setting isActive to false)
   */
  async delete(id: string): Promise<void> {
    console.log('[ProductRepository] Deleting product', { id });
    try {
      await (this.prisma as any).product.update({
        where: { id },
        data: { isActive: false },
      });

      console.log('[ProductRepository] Product deleted successfully:', id);
    } catch (error) {
      console.error('[ProductRepository] Error deleting product:', error);
      throw error;
    }
  }

  /**
   * Map Prisma model to domain entity
   */
  private mapToDomain(productData: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: any; // Decimal type from Prisma
    currency: string;
    image: string | null;
    images: any; // JSON type from Prisma
    categoryId: string | null;
    brandId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    let imagesArray: string[] = [];
    if (productData.images) {
      try {
        imagesArray = typeof productData.images === 'string' 
          ? JSON.parse(productData.images) 
          : productData.images;
      } catch (e) {
        console.error('[ProductRepository] Error parsing images:', e);
      }
    }

    return {
      id: productData.id,
      name: productData.name,
      slug: productData.slug,
      description: productData.description || undefined,
      price: Number(productData.price), // Convert Decimal to number
      currency: productData.currency,
      image: productData.image || undefined,
      images: imagesArray.length > 0 ? imagesArray : undefined,
      categoryId: productData.categoryId || undefined,
      brandId: productData.brandId || undefined,
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    };
  }
}

