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

