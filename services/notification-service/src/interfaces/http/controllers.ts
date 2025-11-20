import { Request, Response } from 'express';
import { SendEmailUseCase } from '../../application/use-cases/send-email.use-case';

/**
 * Send email controller
 */
export async function sendEmailController(req: Request, res: Response) {
  try {
    console.log('[NotificationService] Send email started', { body: req.body });

    const useCase = new SendEmailUseCase();
    await useCase.execute({
      to: req.body.to,
      subject: req.body.subject,
      template: req.body.template,
      data: req.body.data,
    });

    console.log('[NotificationService] Send email success');

    res.json({ success: true });
  } catch (error: any) {
    console.error('[NotificationService] Send email failed', error);
    res.status(400).json({ error: error.message || 'Failed to send email' });
  }
}

