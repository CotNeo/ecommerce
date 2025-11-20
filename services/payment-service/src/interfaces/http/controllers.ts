import { Request, Response } from 'express';
import { CreatePaymentIntentUseCase } from '../../application/use-cases/create-payment-intent.use-case';
import { HandleWebhookUseCase } from '../../application/use-cases/handle-webhook.use-case';

/**
 * Create payment intent controller
 */
export async function createPaymentIntentController(req: Request, res: Response) {
  try {
    console.log('[PaymentService] Create payment intent started', { body: req.body });

    const useCase = new CreatePaymentIntentUseCase();
    const result = await useCase.execute({
      orderId: req.body.orderId,
      amount: req.body.amount,
      currency: req.body.currency || 'TRY',
    });

    console.log('[PaymentService] Create payment intent success', { paymentIntentId: result.paymentIntentId });

    res.json(result);
  } catch (error: any) {
    console.error('[PaymentService] Create payment intent failed', error);
    res.status(400).json({ error: error.message || 'Failed to create payment intent' });
  }
}

/**
 * Handle webhook controller
 */
export async function handleWebhookController(req: Request, res: Response) {
  try {
    console.log('[PaymentService] Webhook received', { body: req.body });

    const useCase = new HandleWebhookUseCase();
    await useCase.execute(req.body);

    console.log('[PaymentService] Webhook processed successfully');

    res.json({ received: true });
  } catch (error: any) {
    console.error('[PaymentService] Webhook processing failed', error);
    res.status(400).json({ error: error.message || 'Failed to process webhook' });
  }
}

