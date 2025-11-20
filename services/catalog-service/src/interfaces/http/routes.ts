import { Router } from 'express';
import { 
  getProductsController, 
  getProductBySlugController,
  createProductController,
  updateProductController,
  deleteProductController,
  getCategoriesController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from './controllers';
import { adminMiddleware } from '../../infrastructure/middleware/auth.middleware';

export const catalogRoutes = Router();

// Public routes
catalogRoutes.get('/products', getProductsController);
catalogRoutes.get('/products/:slug', getProductBySlugController);
catalogRoutes.get('/categories', getCategoriesController);

// Admin routes - Products
catalogRoutes.post('/admin/products', adminMiddleware, createProductController);
catalogRoutes.put('/admin/products/:id', adminMiddleware, updateProductController);
catalogRoutes.delete('/admin/products/:id', adminMiddleware, deleteProductController);

// Admin routes - Categories
catalogRoutes.post('/admin/categories', adminMiddleware, createCategoryController);
catalogRoutes.put('/admin/categories/:id', adminMiddleware, updateCategoryController);
catalogRoutes.delete('/admin/categories/:id', adminMiddleware, deleteCategoryController);

