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
    
    // Debug: Log Prisma Client structure in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[PrismaClient] Prisma Client keys:', Object.keys(prisma));
      console.log('[PrismaClient] Has product property?', 'product' in prisma);
      console.log('[PrismaClient] Has category property?', 'category' in prisma);
      
      if ((prisma as any).product) {
        console.log('[PrismaClient] ✅ Product model found');
      } else {
        console.error('[PrismaClient] ❌ Product model NOT found!');
      }
      
      if ((prisma as any).category) {
        console.log('[PrismaClient] ✅ Category model found');
      } else {
        console.error('[PrismaClient] ❌ Category model NOT found!');
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

