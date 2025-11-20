import { CategoryRepository as ICategoryRepository } from '../../application/ports/category.repository';
import { getPrismaClient } from './prisma-client';

/**
 * Category repository implementation with Prisma
 */
export class CategoryRepositoryImpl implements ICategoryRepository {
  private prisma = getPrismaClient();

  /**
   * Find all categories
   */
  async findAll(): Promise<Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>> {
    console.log('[CategoryRepository] Finding all categories');
    try {
      // Ensure category model exists
      if (!(this.prisma as any).category) {
        console.error('[CategoryRepository] Category model not found in Prisma Client');
        console.error('[CategoryRepository] Available models:', Object.keys(this.prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
        throw new Error('Category model not found in Prisma Client. Please run: npm run prisma:generate');
      }

      const categories = await (this.prisma as any).category.findMany({
        orderBy: { name: 'asc' },
      });

      return categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        parentId: c.parentId,
        isActive: c.isActive,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }));
    } catch (error) {
      console.error('[CategoryRepository] Error finding categories:', error);
      throw error;
    }
  }

  /**
   * Find category by ID
   */
  async findById(id: string): Promise<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    console.log('[CategoryRepository] Finding category by ID:', id);
    try {
      const category = await (this.prisma as any).category.findUnique({
        where: { id },
      });

      if (!category) {
        return null;
      }

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    } catch (error) {
      console.error('[CategoryRepository] Error finding category:', error);
      throw error;
    }
  }

  /**
   * Create category
   */
  async create(data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
  }): Promise<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }> {
    console.log('[CategoryRepository] Creating category', { name: data.name, slug: data.slug });
    try {
      const category = await (this.prisma as any).category.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          parentId: data.parentId,
          isActive: true,
        },
      });

      console.log('[CategoryRepository] Category created successfully:', category.id);
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    } catch (error) {
      console.error('[CategoryRepository] Error creating category:', error);
      throw error;
    }
  }

  /**
   * Update category
   */
  async update(id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: string;
    isActive?: boolean;
  }): Promise<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }> {
    console.log('[CategoryRepository] Updating category', { id, data });
    try {
      const category = await (this.prisma as any).category.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.slug && { slug: data.slug }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.parentId !== undefined && { parentId: data.parentId }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });

      console.log('[CategoryRepository] Category updated successfully:', category.id);
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    } catch (error) {
      console.error('[CategoryRepository] Error updating category:', error);
      throw error;
    }
  }

  /**
   * Delete category (soft delete)
   */
  async delete(id: string): Promise<void> {
    console.log('[CategoryRepository] Deleting category', { id });
    try {
      await (this.prisma as any).category.update({
        where: { id },
        data: { isActive: false },
      });

      console.log('[CategoryRepository] Category deleted successfully:', id);
    } catch (error) {
      console.error('[CategoryRepository] Error deleting category:', error);
      throw error;
    }
  }
}

