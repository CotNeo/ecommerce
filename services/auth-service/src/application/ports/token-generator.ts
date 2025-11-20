/**
 * Token generator interface (port)
 */
export interface TokenGenerator {
  generateAccessToken(payload: { userId: string; email: string; role: string }): string;
  generateRefreshToken(payload: { userId: string }): string;
  verifyAccessToken(token: string): { userId: string; email: string; role: string } | null;
}

