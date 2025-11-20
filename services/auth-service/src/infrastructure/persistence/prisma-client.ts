import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client singleton instance
 */
let prisma: PrismaClient | null = null;

/**
 * Get or create Prisma Client instance
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    console.log('[PrismaClient] Creating new Prisma Client instance');
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
    
    // Debug: Log Prisma Client structure
    if (process.env.NODE_ENV === 'development') {
      console.log('[PrismaClient] Prisma Client keys:', Object.keys(prisma));
      console.log('[PrismaClient] Has user property?', 'user' in prisma);
      console.log('[PrismaClient] Has product property?', 'product' in prisma);
      
      // Check if user model exists
      if ((prisma as any).user) {
        console.log('[PrismaClient] ✅ User model found');
      } else {
        console.error('[PrismaClient] ❌ User model NOT found!');
        console.error('[PrismaClient] Available models:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
        console.error('[PrismaClient] ⚠️  Please run: cd services/auth-service && npm run prisma:generate');
      }
    }
  }
  return prisma;
}

/**
 * Disconnect Prisma Client
 */
export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    console.log('[PrismaClient] Disconnected');
  }
}

