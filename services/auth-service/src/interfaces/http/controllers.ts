import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';

/**
 * Register user controller
 */
export async function registerController(req: Request, res: Response) {
  try {
    console.log('[AuthService] Register started', { email: req.body.email });

    const useCase = new RegisterUserUseCase();
    const result = await useCase.execute(req.body);

    console.log('[AuthService] Register success', { userId: result.id });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('[AuthService] Register failed', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
}

/**
 * Login user controller
 */
export async function loginController(req: Request, res: Response) {
  try {
    console.log('[AuthService] Login started', { email: req.body.email });

    const useCase = new LoginUserUseCase();
    const result = await useCase.execute(req.body);

    console.log('[AuthService] Login success', { userId: result.user.id });

    res.json(result);
  } catch (error: any) {
    console.error('[AuthService] Login failed', error);
    res.status(401).json({ error: error.message || 'Login failed' });
  }
}

/**
 * Get current user controller
 */
export async function meController(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('[AuthService] Get me started');

    const useCase = new GetCurrentUserUseCase();
    const result = await useCase.execute(token);

    console.log('[AuthService] Get me success', { userId: result.id });

    res.json(result);
  } catch (error: any) {
    console.error('[AuthService] Get me failed', error);
    res.status(401).json({ error: error.message || 'Unauthorized' });
  }
}

