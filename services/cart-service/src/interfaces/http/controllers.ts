import { Request, Response } from 'express';
import { GetCartUseCase } from '../../application/use-cases/get-cart.use-case';
import { AddToCartUseCase } from '../../application/use-cases/add-to-cart.use-case';
import { UpdateCartItemUseCase } from '../../application/use-cases/update-cart-item.use-case';
import { RemoveCartItemUseCase } from '../../application/use-cases/remove-cart-item.use-case';

/**
 * Get cart controller
 */
export async function getCartController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId;
    const sessionId = (req.headers['x-session-id'] as string) || (req.query.sessionId as string);

    console.log('[CartService] Get cart started', { userId, sessionId });

    const useCase = new GetCartUseCase();
    const result = await useCase.execute({ userId, sessionId });

    console.log('[CartService] Get cart success', { cartId: result.id });

    res.json(result);
  } catch (error: any) {
    console.error('[CartService] Get cart failed', error);
    res.status(500).json({ error: error.message || 'Failed to get cart' });
  }
}

/**
 * Add to cart controller
 */
export async function addToCartController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId;
    const sessionId = (req.headers['x-session-id'] as string) || req.body.sessionId;

    console.log('[CartService] Add to cart started', { userId, sessionId, body: req.body });

    const useCase = new AddToCartUseCase();
    const result = await useCase.execute({
      userId,
      sessionId,
      productId: req.body.productId,
      variantId: req.body.variantId,
      quantity: req.body.quantity,
    });

    console.log('[CartService] Add to cart success', { cartId: result.id });

    res.json(result);
  } catch (error: any) {
    console.error('[CartService] Add to cart failed', error);
    res.status(400).json({ error: error.message || 'Failed to add to cart' });
  }
}

/**
 * Update cart item controller
 */
export async function updateCartItemController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId;
    const sessionId = (req.headers['x-session-id'] as string) || req.body.sessionId;
    const itemId = req.params.id;
    const quantity = req.body.quantity;

    console.log('[CartService] Update cart item started', { userId, sessionId, itemId, quantity });

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const useCase = new UpdateCartItemUseCase();
    const result = await useCase.execute({
      userId,
      sessionId,
      itemId,
      quantity,
    });

    console.log('[CartService] Update cart item success', { cartId: result.id });

    res.json(result);
  } catch (error: any) {
    console.error('[CartService] Update cart item failed', error);
    res.status(400).json({ error: error.message || 'Failed to update cart item' });
  }
}

/**
 * Remove cart item controller
 */
export async function removeCartItemController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId;
    const sessionId = (req.headers['x-session-id'] as string) || req.query.sessionId as string;
    const itemId = req.params.id;

    console.log('[CartService] Remove cart item started', { userId, sessionId, itemId });

    const useCase = new RemoveCartItemUseCase();
    const result = await useCase.execute({
      userId,
      sessionId,
      itemId,
    });

    console.log('[CartService] Remove cart item success', { cartId: result.id });

    res.json(result);
  } catch (error: any) {
    console.error('[CartService] Remove cart item failed', error);
    res.status(400).json({ error: error.message || 'Failed to remove cart item' });
  }
}

