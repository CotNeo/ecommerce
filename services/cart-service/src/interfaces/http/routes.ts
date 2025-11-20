import { Router } from 'express';
import { getCartController, addToCartController, updateCartItemController, removeCartItemController } from './controllers';

export const cartRoutes = Router();

cartRoutes.get('/cart', getCartController);
cartRoutes.post('/cart/items', addToCartController);
cartRoutes.patch('/cart/items/:id', updateCartItemController);
cartRoutes.delete('/cart/items/:id', removeCartItemController);

