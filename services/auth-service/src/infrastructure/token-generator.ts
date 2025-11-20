import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../application/ports/token-generator';
import { Config } from '@ecommerce/shared-config';

/**
 * JWT token generator implementation
 */
export class JwtTokenGenerator implements TokenGenerator {
  private config = Config.getInstance();
  private jwtSecret = this.config.getJwtSecret();
  private jwtRefreshSecret = this.config.getJwtRefreshSecret();

  generateAccessToken(payload: { userId: string; email: string; role: string }): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(payload: { userId: string }): string {
    return jwt.sign(payload, this.jwtRefreshSecret, {
      expiresIn: '7d',
    });
  }

  verifyAccessToken(token: string): { userId: string; email: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      return null;
    }
  }
}

