import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed database with initial catalog data
 */
async function main() {
  console.log('[CatalogService] Seeding database...');

  // Create brands
  const brand1 = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: {
      name: 'Apple',
      slug: 'apple',
    },
  });

  const brand2 = await prisma.brand.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: {
      name: 'Samsung',
      slug: 'samsung',
    },
  });

  console.log('[CatalogService] Created brands');

  // Create categories
  const category1 = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Elektronik',
      slug: 'electronics',
      description: 'Elektronik ürünler',
    },
  });

  const category2 = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Akıllı Telefonlar',
      slug: 'smartphones',
      description: 'Akıllı telefon kategorisi',
      parentId: category1.id,
    },
  });

  console.log('[CatalogService] Created categories');

  // Create products
  const product1 = await prisma.product.upsert({
    where: { slug: 'iphone-15-pro' },
    update: {},
    create: {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Apple iPhone 15 Pro - En yeni teknoloji ile donatılmış',
      price: 49999.99,
      currency: 'TRY',
      sku: 'IPH15PRO001',
      brandId: brand1.id,
      categoryId: category2.id,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { slug: 'samsung-galaxy-s24' },
    update: {},
    create: {
      name: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Samsung Galaxy S24 - Güçlü performans ve harika kamera',
      price: 39999.99,
      currency: 'TRY',
      sku: 'SGS24001',
      brandId: brand2.id,
      categoryId: category2.id,
    },
  });

  console.log('[CatalogService] Created products');

  // Create product variants
  await prisma.productVariant.createMany({
    data: [
      {
        productId: product1.id,
        name: '128GB',
        type: 'storage',
        sku: 'IPH15PRO001-128',
        stock: 50,
      },
      {
        productId: product1.id,
        name: '256GB',
        type: 'storage',
        sku: 'IPH15PRO001-256',
        stock: 30,
      },
      {
        productId: product1.id,
        name: 'Mavi Titan',
        type: 'color',
        sku: 'IPH15PRO001-BLUE',
        stock: 20,
      },
      {
        productId: product2.id,
        name: '128GB',
        type: 'storage',
        sku: 'SGS24001-128',
        stock: 40,
      },
      {
        productId: product2.id,
        name: '256GB',
        type: 'storage',
        sku: 'SGS24001-256',
        stock: 25,
      },
    ],
    skipDuplicates: true,
  });

  console.log('[CatalogService] Created product variants');

  // Create inventory
  await prisma.inventory.createMany({
    data: [
      {
        productId: product1.id,
        sku: 'IPH15PRO001',
        quantity: 100,
      },
      {
        productId: product2.id,
        sku: 'SGS24001',
        quantity: 80,
      },
    ],
    skipDuplicates: true,
  });

  console.log('[CatalogService] Created inventory');

  // Link products to categories
  await prisma.productCategory.createMany({
    data: [
      {
        productId: product1.id,
        categoryId: category2.id,
      },
      {
        productId: product2.id,
        categoryId: category2.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('[CatalogService] Seeding completed!');
}

main()
  .catch((e) => {
    console.error('[CatalogService] Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

