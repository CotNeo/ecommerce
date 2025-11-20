import { Request, Response } from 'express';
import { CreateOrderDraftUseCase } from '../../application/use-cases/create-order-draft.use-case';
import { MarkOrderPaidUseCase } from '../../application/use-cases/mark-order-paid.use-case';

/**
 * Create order draft controller
 */
export async function createOrderDraftController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId || req.body.userId;
    console.log('[OrderService] Create order draft started', { userId, body: req.body });

    const useCase = new CreateOrderDraftUseCase();
    const result = await useCase.execute({
      userId,
      cartId: req.body.cartId,
      shippingAddressId: req.body.shippingAddressId,
      billingAddressId: req.body.billingAddressId,
    });

    console.log('[OrderService] Create order draft success', { orderId: result.id });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('[OrderService] Create order draft failed', error);
    res.status(400).json({ error: error.message || 'Failed to create order' });
  }
}

/**
 * Get order controller
 */
export async function getOrderController(req: Request, res: Response) {
  try {
    const orderId = req.params.id;
    console.log('[OrderService] Get order started', { orderId });

    const orderRepository = new (require('../../infrastructure/persistence/order.repository').OrderRepositoryImpl)();
    const order = await orderRepository.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('[OrderService] Get order success', { orderId: order.id });
    res.json(order);
  } catch (error: any) {
    console.error('[OrderService] Get order failed', error);
    res.status(500).json({ error: error.message || 'Failed to get order' });
  }
}

/**
 * Get orders controller
 */
export async function getOrdersController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId || (req.query.userId as string);
    const isAdmin = (req as any).user?.role === 'ADMIN';
    console.log('[OrderService] Get orders started', { userId, isAdmin });

    const orderRepository = new (require('../../infrastructure/persistence/order.repository').OrderRepositoryImpl)();
    
    // If admin, return all orders; otherwise require userId
    let orders;
    if (isAdmin) {
      orders = await orderRepository.findAll();
    } else {
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      orders = await orderRepository.findByUserId(userId);
    }

    console.log('[OrderService] Get orders success', { count: orders.length });
    res.json(orders);
  } catch (error: any) {
    console.error('[OrderService] Get orders failed', error);
    res.status(500).json({ error: error.message || 'Failed to get orders' });
  }
}

/**
 * Mark order paid controller
 */
export async function markOrderPaidController(req: Request, res: Response) {
  try {
    console.log('[OrderService] Mark order paid started', { orderId: req.params.id });

    const useCase = new MarkOrderPaidUseCase();
    const result = await useCase.execute(req.params.id);

    console.log('[OrderService] Mark order paid success', { orderId: result.id });

    res.json(result);
  } catch (error: any) {
    console.error('[OrderService] Mark order paid failed', error);
    res.status(400).json({ error: error.message || 'Failed to mark order as paid' });
  }
}

/**
 * Update order status controller (Admin)
 */
export async function updateOrderStatusController(req: Request, res: Response) {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    console.log('[OrderService] Update order status started', { orderId, status });

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const orderRepository = new (require('../../infrastructure/persistence/order.repository').OrderRepositoryImpl)();
    const result = await orderRepository.updateStatus(orderId, status);

    console.log('[OrderService] Update order status success', { orderId: result.id });
    res.json(result);
  } catch (error: any) {
    console.error('[OrderService] Update order status failed', error);
    res.status(400).json({ error: error.message || 'Failed to update order status' });
  }
}

