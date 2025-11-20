# E-Commerce Monorepo

Orta ölçekli, servis bazlı, SOLID prensiplerine uygun Next.js e-ticaret sistemi.

**Geliştirici:** CotNeo

## 📋 Proje Yapısı

```
root/
  apps/
    web/                    # Next.js Frontend (Vercel)
  services/
    auth-service/           # Kimlik doğrulama servisi
    catalog-service/        # Ürün kataloğu servisi
    cart-service/           # Sepet servisi
    order-service/          # Sipariş servisi
    payment-service/        # Ödeme servisi
    notification-service/   # Bildirim servisi
  packages/
    shared-kernel/          # Paylaşılan tipler ve DTO'lar
    shared-config/          # Ortak konfigürasyon
  infra/
    docker-compose.dev.yml  # Geliştirme ortamı için Docker Compose
  scripts/
    setup-database.ps1      # Veritabanı kurulum scripti (PowerShell)
    setup-database.sh       # Veritabanı kurulum scripti (Bash)
    start-all-services.ps1  # Tüm servisleri başlatma scripti
```

## 🏗️ Mimari

### Frontend + BFF
- **Next.js 14+ (App Router)** → Vercel'e dağıtılacak
- **BFF (Backend for Frontend)** pattern ile backend servislerine proxy
- **Tailwind CSS** ile modern ve responsive UI
- **Client & Server Components** ile optimize edilmiş performans

### Backend Servisleri
Her servis kendi sorumluluğuna sahip, bağımsız çalışabilen mikroservisler:

1. **Auth Service** (Port: 3001)
   - Kullanıcı kayıt, login, logout
   - JWT token yönetimi (Access & Refresh tokens)
   - Rol ve yetki yönetimi (ADMIN, USER)
   - Kullanıcı profil yönetimi

2. **Catalog Service** (Port: 3002)
   - Ürünler, kategoriler, markalar
   - Ürün görsel yönetimi
   - Stok ve fiyat yönetimi
   - Ürün varyantları (renk, beden, vb.)
   - Admin CRUD işlemleri

3. **Cart Service** (Port: 3003)
   - Kullanıcı sepeti
   - Anonim sepet desteği (session-based)
   - Sepet ürün yönetimi (ekle, güncelle, sil)

4. **Order Service** (Port: 3004)
   - Sipariş oluşturma ve yönetimi
   - Sipariş durumu takibi (DRAFT, PENDING_PAYMENT, PAID, SHIPPED, COMPLETED, CANCELLED)
   - Admin sipariş yönetimi
   - Sipariş geçmişi

5. **Payment Service** (Port: 3005)
   - Ödeme intent oluşturma
   - Webhook işleme
   - Ödeme durumu takibi

6. **Notification Service** (Port: 3006)
   - E-posta bildirimleri
   - Şablon yönetimi
   - Bildirim log'ları

### Veritabanı
- **PostgreSQL** (Docker Compose ile local development)
- Her servis için ayrı schema: `auth`, `catalog`, `cart`, `orders`, `payments`, `notifications`
- **ORM: Prisma** (her serviste kendi `schema.prisma`)
- Multi-schema desteği ile izole veri yönetimi

## 🚀 Başlangıç

### Gereksinimler
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (geliştirme için)
- PostgreSQL (Docker ile otomatik kurulum)

### Hızlı Kurulum

1. **Bağımlılıkları yükle:**
```bash
npm install
```

2. **PostgreSQL'i başlat (Docker ile):**
```bash
cd infra
docker-compose -f docker-compose.dev.yml up -d
```

3. **Veritabanını kur (PowerShell):**
```powershell
.\scripts\setup-database.ps1
```

veya manuel olarak:
```bash
# Her servis için
cd services/{service-name}
npm run prisma:generate
npx prisma db push
npm run prisma:seed  # Eğer seed varsa
```

4. **Tüm servisleri başlat:**
```powershell
.\scripts\start-all-services.ps1
```

veya manuel olarak:
```bash
npm run dev
```

### Environment Değişkenleri

Her servis için `.env` dosyası oluşturun. Örnekler için `DATABASE_SETUP.md` dosyasına bakın.

**Önemli:** Her servis için `DATABASE_URL` şu formatta olmalı:
```
postgresql://postgres:postgres@localhost:5432/ecommerce?schema={schema_name}
```

## 📁 Servis Yapısı (SOLID Prensipleri)

Her servis aşağıdaki katmanlı yapıya sahiptir:

```
services/{service-name}/src
  domain/
    entities/         # Domain entity'leri
    value-objects/    # Value object'ler
    services/         # Domain servisleri
    events/           # Domain event'leri
  application/
    use-cases/        # Use case'ler
    dto/              # DTO'lar
    ports/            # Repository ve adapter interface'leri
  infrastructure/
    persistence/      # Prisma, repository implementasyonları
    http/             # External API client'ları
    config/           # Konfigürasyon
    middleware/       # Auth, admin middleware'leri
  interfaces/
    http/             # REST controller'lar / route handler'lar
    subscribers/      # Event subscriber'lar
```

## 🔧 Özellikler

### Frontend Özellikleri
- ✅ Modern ve responsive tasarım (Tailwind CSS)
- ✅ Ürün listeleme, filtreleme, arama
- ✅ Ürün detay sayfası
- ✅ Sepet yönetimi
- ✅ Kullanıcı girişi/kayıt
- ✅ Kullanıcı hesap yönetimi
- ✅ Admin paneli (ürün, kategori, sipariş yönetimi)
- ✅ Dosya yükleme (görsel yönetimi)

### Admin Panel Özellikleri
- ✅ Ürün CRUD işlemleri
- ✅ Kategori CRUD işlemleri
- ✅ Sipariş yönetimi ve durum güncelleme
- ✅ Görsel yükleme (dosya upload)
- ✅ Rol tabanlı erişim kontrolü (RBAC)
- ✅ Gerçek zamanlı veri güncelleme

### Backend Özellikleri
- ✅ RESTful API
- ✅ JWT tabanlı kimlik doğrulama
- ✅ Role-based access control (RBAC)
- ✅ Prisma ORM ile veritabanı yönetimi
- ✅ Multi-schema database desteği
- ✅ Error handling ve logging
- ✅ Health check endpoints

## 📝 API Endpoints

### BFF Endpoints (Next.js)

#### Authentication
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

#### Products
- `GET /api/products/list` - Ürün listesi (filtreleme, sıralama, sayfalama)
- `GET /api/products/[slug]` - Ürün detayı

#### Categories
- `GET /api/categories` - Kategori listesi

#### Cart
- `GET /api/cart` - Sepet bilgisi
- `POST /api/cart/items` - Sepete ürün ekleme
- `PUT /api/cart/items/[id]` - Sepet ürünü güncelleme
- `DELETE /api/cart/items/[id]` - Sepet ürünü silme

#### Admin - Products
- `GET /api/admin/products` - Tüm ürünleri listele (Admin)
- `POST /api/admin/products` - Yeni ürün oluştur (Admin)
- `PUT /api/admin/products/[id]` - Ürün güncelle (Admin)
- `DELETE /api/admin/products/[id]` - Ürün sil (Admin)

#### Admin - Categories
- `GET /api/admin/categories` - Tüm kategorileri listele (Admin)
- `POST /api/admin/categories` - Yeni kategori oluştur (Admin)
- `PUT /api/admin/categories/[id]` - Kategori güncelle (Admin)
- `DELETE /api/admin/categories/[id]` - Kategori sil (Admin)

#### Orders
- `GET /api/orders` - Kullanıcı siparişleri (veya tüm siparişler - Admin)
- `PUT /api/orders/[id]/status` - Sipariş durumu güncelle (Admin)

#### Upload
- `POST /api/upload` - Dosya yükleme (Admin, görseller için)

### Backend Service Endpoints

Her servis kendi `/api/v1` prefix'i ile endpoint'ler sunar. Detaylar için ilgili servis dokümantasyonuna bakın.

## 🗄️ Veritabanı Yönetimi

### Prisma Komutları

Her servis için:

```bash
# Prisma Client oluştur
npm run prisma:generate

# Schema değişikliklerini veritabanına uygula (development)
npx prisma db push

# Migration oluştur ve uygula
npm run prisma:migrate

# Prisma Studio'yu aç (GUI)
npm run prisma:studio

# Seed data yükle (varsa)
npm run prisma:seed
```

### Schema Değişiklikleri

1. `prisma/schema.prisma` dosyasını düzenle
2. Development için: `npx prisma db push`
3. Production için: `npm run prisma:migrate` (migration oluştur)

## 🔐 Giriş Bilgileri

### Test Kullanıcıları

**Admin:**
- Email: `admin@ecommerce.com`
- Password: `admin123`
- Rol: ADMIN (tüm admin paneli özelliklerine erişim)

**Kullanıcı:**
- Email: `user@ecommerce.com`
- Password: `user123`
- Rol: USER (sadece alışveriş yapabilir)

## 🧪 Test

```bash
# Tüm servisleri test et
npm run test

# Belirli bir servisi test et
cd services/{service-name}
npm test
```

## 🏗️ Build

```bash
# Tüm projeyi build et
npm run build

# Belirli bir servisi build et
cd services/{service-name}
npm run build
```

## 📚 Dokümantasyon

- **Mimari Dokümantasyon:** `ARCHITECTURE.md`
- **Veritabanı Kurulum:** `DATABASE_SETUP.md`
- **API Dokümantasyonu:** Her servis için `README.md` (gelecek)

## 🛠️ Geliştirme Araçları

### Scripts

- `scripts/setup-database.ps1` - Veritabanı kurulum scripti (PowerShell)
- `scripts/setup-database.sh` - Veritabanı kurulum scripti (Bash)
- `scripts/start-all-services.ps1` - Tüm servisleri başlatma scripti

### Servisleri Ayrı Ayrı Çalıştırma

```bash
# Auth Service
cd services/auth-service
npm run dev

# Catalog Service
cd services/catalog-service
npm run dev

# Cart Service
cd services/cart-service
npm run dev

# Order Service
cd services/order-service
npm run dev

# Payment Service
cd services/payment-service
npm run dev

# Notification Service
cd services/notification-service
npm run dev

# Web App
cd apps/web
npm run dev
```

## 🛣️ Roadmap

1. ✅ Temel iskelet yapısı
2. ✅ Prisma şemaları ve veritabanı
3. ✅ Repository implementasyonları (Prisma ile)
4. ✅ Servisler arası iletişim
5. ✅ Admin panel geliştirmeleri
6. ✅ Dosya yükleme özelliği
7. ✅ Rol tabanlı erişim kontrolü
8. ⏳ Ödeme & Notification entegrasyonu (tam entegrasyon)
9. ⏳ Unit ve integration testleri
10. ⏳ Performance optimizasyonu
11. ⏳ Caching (Redis)
12. ⏳ Message Queue (RabbitMQ/Kafka)
13. ⏳ Monitoring & Logging (ELK Stack)

## 📄 Lisans

Bu proje özel bir projedir.

## 👨‍💻 Geliştirici

**CotNeo**

---

Son güncelleme: 2025
