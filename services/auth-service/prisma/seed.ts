import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Seed database with initial data
 */
async function main() {
  console.log('[AuthService] Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  console.log('[AuthService] Created admin user:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@ecommerce.com' },
    update: {},
    create: {
      email: 'user@ecommerce.com',
      password: userPassword,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
    },
  });

  console.log('[AuthService] Created test user:', user.email);

  // Create test address for user
  await prisma.userAddress.upsert({
    where: { id: 'test-address-1' },
    update: {},
    create: {
      id: 'test-address-1',
      userId: user.id,
      firstName: 'Test',
      lastName: 'User',
      addressLine1: 'Test Mahallesi, Test Sokak No: 123',
      city: 'Istanbul',
      postalCode: '34000',
      country: 'TR',
      phone: '+905551234567',
      isDefault: true,
    },
  });

  console.log('[AuthService] Seeding completed!');
}

main()
  .catch((e) => {
    console.error('[AuthService] Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

