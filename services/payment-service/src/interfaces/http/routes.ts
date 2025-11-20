import { Router } from 'express';
import { createPaymentIntentController, handleWebhookController } from './controllers';

export const paymentRoutes = Router();

paymentRoutes.post('/payments/create-intent', createPaymentIntentController);
paymentRoutes.post('/payments/webhook', handleWebhookController);

