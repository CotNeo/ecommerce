import { Router } from 'express';
import { sendEmailController } from './controllers';

export const notificationRoutes = Router();

notificationRoutes.post('/notifications/send-email', sendEmailController);

