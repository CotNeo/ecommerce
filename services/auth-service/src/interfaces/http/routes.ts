import { Router } from 'express';
import { loginController, registerController, meController } from './controllers';

export const authRoutes = Router();

authRoutes.post('/auth/register', registerController);
authRoutes.post('/auth/login', loginController);
authRoutes.get('/auth/me', meController);

