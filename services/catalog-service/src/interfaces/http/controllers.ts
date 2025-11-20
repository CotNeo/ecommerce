import { Request, Response } from 'express';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { GetProductBySlugUseCase } from '../../application/use-cases/get-product-by-slug.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';
import { GetCategoriesUseCase } from '../../application/use-cases/get-categories.use-case';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use-cases/delete-category.use-case';

/**
 * Get products controller
 */
export async function getProductsController(req: Request, res: Response) {
  try {
    console.log('[CatalogService] Get products started', { query: req.query });

    const useCase = new GetProductsUseCase();
    const result = await useCase.execute({
      categoryId: req.query.categoryId as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    });

    console.log('[CatalogService] Get products success', { count: result.length });

    res.json(result);
  } catch (error: any) {
    console.error('[CatalogService] Get products failed', error);
    res.status(500).json({ error: error.message || 'Failed to get products' });
  }
}

/**
 * Get product by slug controller
 */
export async function getProductBySlugController(req: Request, res: Response) {
  try {
    console.log('[CatalogService] Get product by slug started', { slug: req.params.slug });

    const useCase = new GetProductBySlugUseCase();
    const result = await useCase.execute(req.params.slug);

    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('[CatalogService] Get product by slug success', { productId: result.id });

    res.json(result);
  } catch (error: any) {
    console.error('[CatalogService] Get product by slug failed', error);
    res.status(500).json({ error: error.message || 'Failed to get product' });
  }
}

/**
 * Create product controller (Admin only)
 */
export async function createProductController(req: Request, res: Response) {
  try {
    console.log('[CatalogService] Create product started', { body: req.body });

    const useCase = new CreateProductUseCase();
    const result = await useCase.execute(req.body);

    console.log('[CatalogService] Create product success', { productId: result.id });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('[CatalogService] Create product failed', error);
    res.status(400).json({ error: error.message || 'Failed to create product' });
  }
}

/**
 * Update product controller (Admin only)
 */
export async function updateProductController(req: Request, res: Response) {
  try {
    const productId = req.params.id;
    console.log('[CatalogService] Update product started', { productId, body: req.body });

    const useCase = new UpdateProductUseCase();
    const result = await useCase.execute(productId, req.body);

    console.log('[CatalogService] Update product success', { productId: result.id });

    res.json(result);
  } catch (error: any) {
    console.error('[CatalogService] Update product failed', error);
    res.status(400).json({ error: error.message || 'Failed to update product' });
  }
}

/**
 * Delete product controller (Admin only)
 */
export async function deleteProductController(req: Request, res: Response) {
  try {
    const productId = req.params.id;
    console.log('[CatalogService] Delete product started', { productId });

    const useCase = new DeleteProductUseCase();
    await useCase.execute(productId);

    console.log('[CatalogService] Delete product success', { productId });

    res.json({ success: true });
  } catch (error: any) {
    console.error('[CatalogService] Delete product failed', error);
    res.status(400).json({ error: error.message || 'Failed to delete product' });
  }
}

/**
 * Get categories controller
 */
export async function getCategoriesController(req: Request, res: Response) {
  try {
    console.log('[CatalogService] Get categories started');

    const useCase = new GetCategoriesUseCase();
    const result = await useCase.execute();

    console.log('[CatalogService] Get categories success', { count: result.length });

    res.json(result);
  } catch (error: any) {
    console.error('[CatalogService] Get categories failed', error);
    res.status(500).json({ error: error.message || 'Failed to get categories' });
  }
}

/**
 * Create category controller (Admin only)
 */
export async function createCategoryController(req: Request, res: Response) {
  try {
    console.log('[CatalogService] Create category started', { body: req.body });

    const useCase = new CreateCategoryUseCase();
    const result = await useCase.execute(req.body);

    console.log('[CatalogService] Create category success', { categoryId: result.id });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('[CatalogService] Create category failed', error);
    res.status(400).json({ error: error.message || 'Failed to create category' });
  }
}

/**
 * Update category controller (Admin only)
 */
export async function updateCategoryController(req: Request, res: Response) {
  try {
    const categoryId = req.params.id;
    console.log('[CatalogService] Update category started', { categoryId, body: req.body });

    const useCase = new UpdateCategoryUseCase();
    const result = await useCase.execute(categoryId, req.body);

    console.log('[CatalogService] Update category success', { categoryId: result.id });

    res.json(result);
  } catch (error: any) {
    console.error('[CatalogService] Update category failed', error);
    res.status(400).json({ error: error.message || 'Failed to update category' });
  }
}

/**
 * Delete category controller (Admin only)
 */
export async function deleteCategoryController(req: Request, res: Response) {
  try {
    const categoryId = req.params.id;
    console.log('[CatalogService] Delete category started', { categoryId });

    const useCase = new DeleteCategoryUseCase();
    await useCase.execute(categoryId);

    console.log('[CatalogService] Delete category success', { categoryId });

    res.json({ success: true });
  } catch (error: any) {
    console.error('[CatalogService] Delete category failed', error);
    res.status(400).json({ error: error.message || 'Failed to delete category' });
  }
}

