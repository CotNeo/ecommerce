# Veritabanı Kurulum Rehberi

Bu doküman, tüm servisler için Prisma veritabanı kurulumunu açıklar.

**Geliştirici:** CotNeo

## Ön Gereksinimler

1. PostgreSQL çalışıyor olmalı (Docker Compose ile başlatılmış)
2. Her servis için `.env` dosyası oluşturulmuş olmalı
3. Node.js ve npm yüklü olmalı

## Hızlı Kurulum

### PowerShell (Windows)

```powershell
.\scripts\setup-database.ps1
```

### Bash (Linux/Mac)

```bash
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

Bu script otomatik olarak:
1. Her servis için Prisma Client generate eder
2. Database schema'larını oluşturur (`prisma db push`)
3. Seed data'yı yükler (varsa)

## Manuel Kurulum

### 1. Auth Service

```bash
cd services/auth-service
npm run prisma:generate
npx prisma db push
npm run prisma:seed
```

**Schema:** `auth`  
**Seed Data:** Admin ve test kullanıcıları oluşturur

**Seed Kullanıcıları:**
- Admin: `admin@ecommerce.com` / `admin123`
- User: `user@ecommerce.com` / `user123`

### 2. Catalog Service

```bash
cd services/catalog-service
npm run prisma:generate
npx prisma db push
npm run prisma:seed
```

**Schema:** `catalog`  
**Seed Data:** Örnek ürünler, kategoriler, markalar oluşturur

**Seed İçeriği:**
- 2 marka (Apple, Samsung)
- 2 kategori (Elektronik, Akıllı Telefonlar)
- 2 ürün (iPhone 15 Pro, Samsung Galaxy S24)
- Ürün varyantları ve stok bilgileri

### 3. Cart Service

```bash
cd services/cart-service
npm run prisma:generate
npx prisma db push
```

**Schema:** `cart`  
**Seed Data:** Yok (kullanıcılar sepet oluşturdukça oluşur)

### 4. Order Service

```bash
cd services/order-service
npm run prisma:generate
npx prisma db push
```

**Schema:** `orders`  
**Seed Data:** Yok (siparişler oluşturuldukça oluşur)

### 5. Payment Service

```bash
cd services/payment-service
npm run prisma:generate
npx prisma db push
```

**Schema:** `payments`  
**Seed Data:** Yok (ödeme intent'leri oluşturuldukça oluşur)

### 6. Notification Service

```bash
cd services/notification-service
npm run prisma:generate
npx prisma db push
npm run prisma:seed
```

**Schema:** `notifications`  
**Seed Data:** E-posta şablonları oluşturur

**Seed Şablonları:**
- `order_created` - Sipariş oluşturuldu e-postası
- `order_paid` - Ödeme alındı e-postası
- `order_shipped` - Kargoya verildi e-postası
- `password_reset` - Şifre sıfırlama e-postası

## Environment Variables

Her servis için `.env` dosyası oluşturun:

### Auth Service (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce?schema=auth
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-for-development
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-long-for-development
PORT=3001
NODE_ENV=development
```

### Catalog Service (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce?schema=catalog
PORT=3002
NODE_ENV=development
```

### Cart Service (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce?schema=cart
CATALOG_SERVICE_URL=http://localhost:3002
PORT=3003
NODE_ENV=development
```

### Order Service (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce?schema=orders
CART_SERVICE_URL=http://localhost:3003
CATALOG_SERVICE_URL=http://localhost:3002
NOTIFICATION_SERVICE_URL=http://localhost:3006
PORT=3004
NODE_ENV=development
```

### Payment Service (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce?schema=payments
ORDER_SERVICE_URL=http://localhost:3004
PAYMENT_PROVIDER_API_KEY=your-payment-provider-api-key
PAYMENT_PROVIDER_SECRET_KEY=your-payment-provider-secret-key
PORT=3005
NODE_ENV=development
```

### Notification Service (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce?schema=notifications
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
PORT=3006
NODE_ENV=development
```

## Prisma Komutları

Her servis için kullanılabilir komutlar:

```bash
# Prisma Client oluştur
npm run prisma:generate

# Schema değişikliklerini veritabanına uygula (development)
npx prisma db push

# Yeni migration oluştur
npm run prisma:migrate -- --name migration_name

# Migration'ları uygula (production)
npm run prisma:migrate deploy

# Prisma Studio'yu aç (GUI)
npm run prisma:studio

# Seed data yükle
npm run prisma:seed
```

## Veritabanı Şemaları

### auth Schema

**Tablolar:**
- `users` - Kullanıcılar
  - `id`, `email`, `password`, `firstName`, `lastName`, `role`, `createdAt`, `updatedAt`
- `user_addresses` - Kullanıcı adresleri
  - `id`, `userId`, `firstName`, `lastName`, `addressLine1`, `addressLine2`, `city`, `state`, `postalCode`, `country`, `phone`, `isDefault`
- `refresh_tokens` - Refresh token'lar
  - `id`, `userId`, `token`, `expiresAt`, `createdAt`

**Enum:**
- `UserRole`: USER, ADMIN

### catalog Schema

**Tablolar:**
- `products` - Ürünler
  - `id`, `name`, `slug`, `description`, `price`, `currency`, `sku`, `image`, `images` (JSON), `categoryId`, `brandId`, `isActive`, `createdAt`, `updatedAt`
- `product_variants` - Ürün varyantları
  - `id`, `productId`, `name`, `type`, `sku`, `price`, `stock`, `isActive`
- `categories` - Kategoriler
  - `id`, `name`, `slug`, `description`, `parentId`, `isActive`
- `product_categories` - Ürün-kategori ilişkileri (many-to-many)
  - `id`, `productId`, `categoryId`
- `brands` - Markalar
  - `id`, `name`, `slug`, `logo`, `isActive`
- `inventory` - Stok bilgileri
  - `id`, `productId`, `variantId`, `sku`, `quantity`, `reserved`

### cart Schema

**Tablolar:**
- `carts` - Sepetler
  - `id`, `userId`, `sessionId`, `createdAt`, `updatedAt`
- `cart_items` - Sepet ürünleri
  - `id`, `cartId`, `productId`, `variantId`, `quantity`, `unitPrice`, `totalPrice`, `createdAt`, `updatedAt`

### orders Schema

**Tablolar:**
- `orders` - Siparişler
  - `id`, `userId`, `status`, `totalAmount`, `currency`, `shippingAddress` (JSON), `billingAddress` (JSON), `shippingCost`, `taxAmount`, `discountAmount`, `createdAt`, `updatedAt`
- `order_items` - Sipariş kalemleri
  - `id`, `orderId`, `productId`, `variantId`, `sku`, `name`, `quantity`, `unitPrice`, `totalPrice`
- `order_status_history` - Sipariş durum geçmişi
  - `id`, `orderId`, `status`, `note`, `createdAt`

**Enum:**
- `OrderStatus`: DRAFT, PENDING_PAYMENT, PAID, SHIPPED, COMPLETED, CANCELLED

### payments Schema

**Tablolar:**
- `payment_intents` - Ödeme intent'leri
  - `id`, `orderId`, `amount`, `currency`, `status`, `provider`, `providerIntentId`, `metadata` (JSON), `createdAt`, `updatedAt`
- `payment_logs` - Ödeme log'ları
  - `id`, `paymentIntentId`, `event`, `data` (JSON), `createdAt`

**Enum:**
- `PaymentStatus`: PENDING, SUCCEEDED, FAILED, CANCELLED

### notifications Schema

**Tablolar:**
- `notification_templates` - Bildirim şablonları
  - `id`, `name`, `type`, `subject`, `body`, `variables` (JSON), `isActive`, `createdAt`, `updatedAt`
- `notification_logs` - Bildirim log'ları
  - `id`, `templateId`, `recipient`, `subject`, `body`, `status`, `error`, `sentAt`, `createdAt`

## Seed Data Detayları

### Auth Service Seed

**Kullanıcılar:**
1. **Admin Kullanıcı**
   - Email: `admin@ecommerce.com`
   - Password: `admin123` (bcrypt hash)
   - Role: `ADMIN`
   - First Name: `Admin`
   - Last Name: `User`

2. **Test Kullanıcı**
   - Email: `user@ecommerce.com`
   - Password: `user123` (bcrypt hash)
   - Role: `USER`
   - First Name: `Test`
   - Last Name: `User`

### Catalog Service Seed

**Markalar:**
- Apple
- Samsung

**Kategoriler:**
- Elektronik (parent)
- Akıllı Telefonlar (child of Elektronik)

**Ürünler:**
1. **iPhone 15 Pro**
   - Price: 49999.99 TRY
   - SKU: IPH15PRO001
   - Brand: Apple
   - Category: Akıllı Telefonlar
   - Variants: 128GB, 256GB, Mavi Titan

2. **Samsung Galaxy S24**
   - Price: 39999.99 TRY
   - SKU: SGS24001
   - Brand: Samsung
   - Category: Akıllı Telefonlar
   - Variants: 128GB, 256GB

### Notification Service Seed

**E-posta Şablonları:**
1. `order_created` - Sipariş oluşturuldu
2. `order_paid` - Ödeme alındı
3. `order_shipped` - Kargoya verildi
4. `password_reset` - Şifre sıfırlama

## Sorun Giderme

### Migration Hatası

Eğer migration hatası alırsanız:

1. **Development ortamında:**
   ```bash
   # Schema'yı sıfırla
   npx prisma db push --force-reset
   ```

2. **Production ortamında:**
   ```bash
   # Migration'ı düzelt ve tekrar çalıştır
   npm run prisma:migrate deploy
   ```

### Prisma Client Hatası

**Hata:** `Cannot read properties of undefined (reading 'findUnique')`

**Çözüm:**
```bash
# Servisi durdur
# Prisma Client'ı yeniden generate et
npm run prisma:generate
# Servisi yeniden başlat
```

### Connection Hatası

**Hata:** `P1002 The database server was reached but timed out`

**Çözüm:**
1. PostgreSQL'in çalıştığından emin olun:
   ```bash
   docker ps
   ```

2. DATABASE_URL'in doğru olduğunu kontrol edin
3. Schema parametresinin doğru olduğunu kontrol edin
4. Port'un açık olduğunu kontrol edin (5432)

### Multi-Schema Hatası

**Hata:** `The schemas property is only available with the multiSchema preview feature`

**Çözüm:**
`prisma/schema.prisma` dosyasında `previewFeatures` ekleyin:
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}
```

### EPERM Hatası (Windows)

**Hata:** `EPERM: operation not permitted, rename`

**Çözüm:**
1. Tüm servisleri durdurun
2. Prisma Client'ı generate edin
3. Servisleri yeniden başlatın

## Veritabanı Yönetimi

### Prisma Studio

Her servis için Prisma Studio'yu açabilirsiniz:

```bash
cd services/{service-name}
npm run prisma:studio
```

Bu, web tabanlı bir GUI açar ve veritabanı içeriğini görüntülemenize ve düzenlemenize olanak tanır.

### Backup ve Restore

**Backup:**
```bash
pg_dump -h localhost -U postgres -d ecommerce > backup.sql
```

**Restore:**
```bash
psql -h localhost -U postgres -d ecommerce < backup.sql
```

## Production Deployment

### Migration Stratejisi

Production'da migration'ları uygulamak için:

```bash
npm run prisma:migrate deploy
```

Bu komut, pending migration'ları uygular ancak yeni migration oluşturmaz.

### Environment Variables

Production ortamında:
- Güçlü JWT secret'lar kullanın
- Database connection string'i güvenli tutun
- SMTP credentials'ları doğru yapılandırın
- Payment provider API key'lerini güvenli tutun

---

**Geliştirici:** CotNeo  
**Son Güncelleme:** 2025
