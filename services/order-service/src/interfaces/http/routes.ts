import { Router } from 'express';
import { 
  createOrderDraftController, 
  getOrderController, 
  getOrdersController, 
  markOrderPaidController,
  updateOrderStatusController
} from './controllers';
import { authMiddleware, adminMiddleware } from '../../infrastructure/middleware/auth.middleware';

export const orderRoutes = Router();

orderRoutes.post('/orders/draft', createOrderDraftController);
orderRoutes.get('/orders/:id', getOrderController);
orderRoutes.get('/orders', authMiddleware, getOrdersController);
orderRoutes.patch('/orders/:id/mark-paid', markOrderPaidController);
orderRoutes.put('/orders/:id/status', authMiddleware, adminMiddleware, updateOrderStatusController);

