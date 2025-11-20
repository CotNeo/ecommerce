# Mimari Dokümantasyon

Bu doküman, e-ticaret sisteminin detaylı mimari yapısını açıklar.

**Geliştirici:** CotNeo

## Genel Bakış

Sistem, mikroservis mimarisi prensiplerine uygun olarak tasarlanmıştır. Her servis kendi sorumluluğuna sahiptir ve bağımsız olarak geliştirilebilir, test edilebilir ve dağıtılabilir.

## Katmanlı Mimari (SOLID)

Her servis aşağıdaki katmanlara ayrılmıştır:

### 1. Domain Layer
- **Entities**: İş mantığını içeren domain entity'leri
- **Value Objects**: Değer nesneleri (Email, Money, Address vb.)
- **Domain Services**: Domain mantığını içeren servisler
- **Events**: Domain event'leri

### 2. Application Layer
- **Use Cases**: İş akışlarını yöneten use case'ler
- **DTOs**: Veri transfer nesneleri
- **Ports**: Repository ve adapter interface'leri (Dependency Inversion)

### 3. Infrastructure Layer
- **Persistence**: Veritabanı implementasyonları (Prisma)
- **External Services**: Dış servis client'ları (Payment Provider, Email Provider)
- **Config**: Konfigürasyon yönetimi
- **Middleware**: Authentication, authorization middleware'leri

### 4. Interfaces Layer
- **HTTP**: REST API controller'ları ve route handler'ları
- **Subscribers**: Event subscriber'lar (Message Queue vb.)

## Servis Detayları

### Auth Service

**Sorumluluk:** Kullanıcı kimlik doğrulama ve yetkilendirme

**Özellikler:**
- Kullanıcı kayıt ve giriş
- JWT token yönetimi (Access & Refresh tokens)
- Rol tabanlı erişim kontrolü (ADMIN, USER)
- Kullanıcı profil yönetimi
- Refresh token yönetimi

**Database Schema:** `auth`
- `users` - Kullanıcılar
- `user_addresses` - Kullanıcı adresleri
- `refresh_tokens` - Refresh token'lar

### Catalog Service

**Sorumluluk:** Ürün kataloğu yönetimi

**Özellikler:**
- Ürün CRUD işlemleri
- Kategori yönetimi
- Marka yönetimi
- Ürün varyantları (renk, beden, vb.)
- Stok yönetimi
- Ürün görsel yönetimi
- Admin paneli için özel endpoint'ler

**Database Schema:** `catalog`
- `products` - Ürünler (image, images alanları ile)
- `product_variants` - Ürün varyantları
- `categories` - Kategoriler
- `product_categories` - Ürün-kategori ilişkileri
- `brands` - Markalar
- `inventory` - Stok bilgileri

### Cart Service

**Sorumluluk:** Sepet yönetimi

**Özellikler:**
- Kullanıcı sepeti
- Anonim sepet desteği (session-based)
- Sepet ürün ekleme, güncelleme, silme
- Sepet toplam hesaplama

**Database Schema:** `cart`
- `carts` - Sepetler
- `cart_items` - Sepet ürünleri

### Order Service

**Sorumluluk:** Sipariş yönetimi

**Özellikler:**
- Sipariş oluşturma
- Sipariş durumu yönetimi
- Sipariş geçmişi
- Admin sipariş yönetimi
- Sipariş durum geçmişi

**Database Schema:** `orders`
- `orders` - Siparişler
- `order_items` - Sipariş kalemleri
- `order_status_history` - Sipariş durum geçmişi

### Payment Service

**Sorumluluk:** Ödeme işlemleri

**Özellikler:**
- Ödeme intent oluşturma
- Webhook işleme
- Ödeme durumu takibi
- Ödeme log'ları

**Database Schema:** `payments`
- `payment_intents` - Ödeme intent'leri
- `payment_logs` - Ödeme log'ları

### Notification Service

**Sorumluluk:** Bildirim yönetimi

**Özellikler:**
- E-posta bildirimleri
- Şablon yönetimi
- Bildirim log'ları
- Şablon tabanlı mesajlaşma

**Database Schema:** `notifications`
- `notification_templates` - Bildirim şablonları
- `notification_logs` - Bildirim log'ları

## Servis İletişimi

### Senkron İletişim
Servisler arası senkron iletişim HTTP REST API üzerinden yapılır. BFF (Backend for Frontend) pattern kullanılarak frontend'den backend servislerine proxy yapılır.

**Örnek Akış:**
1. Frontend → BFF (`/api/products`)
2. BFF → Catalog Service (`http://localhost:3002/api/v1/products`)
3. Catalog Service → Response
4. BFF → Frontend

### Asenkron İletişim (Gelecek)
Event-driven mimari için message queue (RabbitMQ, Kafka vb.) eklenebilir.

## Veritabanı Stratejisi

### Database per Service Pattern
- **Shared Database**: Tek PostgreSQL cluster, ayrı şemalar
- **Schema Isolation**: Her servis kendi schema'sına sahip
- **ORM**: Prisma (her serviste ayrı `schema.prisma`)
- **Multi-Schema Support**: Prisma multi-schema preview feature kullanılıyor

### Schema Yapısı
```
ecommerce (database)
├── auth (schema)
├── catalog (schema)
├── cart (schema)
├── orders (schema)
├── payments (schema)
└── notifications (schema)
```

## Güvenlik

### Authentication
- **JWT (JSON Web Tokens)**: Access ve refresh token'lar
- **Token Expiration**: Access token kısa süreli, refresh token uzun süreli
- **Token Refresh**: Refresh token ile yeni access token alma

### Authorization
- **Role-Based Access Control (RBAC)**: ADMIN ve USER rolleri
- **Middleware**: `authMiddleware` ve `adminMiddleware`
- **Protected Routes**: Admin endpoint'leri sadece ADMIN rolüne açık

### Input Validation
- **Zod**: Environment variable validation
- **Type Safety**: TypeScript ile tip güvenliği
- **Sanitization**: Input sanitization (gelecek)

## Frontend Mimarisi

### Next.js App Router
- **Server Components**: Varsayılan olarak server component'ler
- **Client Components**: Interaktif özellikler için client component'ler
- **Suspense Boundaries**: Loading state'leri için
- **Dynamic Routes**: `[slug]`, `[id]` gibi dinamik route'lar

### State Management
- **React Hooks**: `useState`, `useEffect` ile local state
- **Custom Events**: Cross-component communication (`auth-change` event)
- **localStorage**: Token ve session yönetimi

### File Upload
- **API Route**: `/api/upload` endpoint'i
- **File Storage**: `/public/uploads/products/` klasörü
- **Security**: Admin-only access, file type validation, size limits

## Ölçeklenebilirlik

### Horizontal Scaling
- Her servis bağımsız olarak ölçeklenebilir
- Stateless servisler (JWT token'lar hariç)
- Load balancing hazır (gelecek)

### Caching (Gelecek)
- **Redis**: Session ve cache yönetimi
- **CDN**: Static asset'ler için
- **API Caching**: Response caching

### Database Scaling
- **Read Replicas**: Read-heavy işlemler için
- **Connection Pooling**: Prisma connection pooling
- **Indexing**: Performans için index'ler

## Monitoring & Logging

### Logging
- **Structured Logging**: Her servis kendi log'larını tutar
- **Console Logging**: Development için console.log
- **Log Levels**: Error, warn, info, debug

### Health Checks
- **Health Endpoints**: Her serviste `/health` endpoint'i
- **Status Monitoring**: Service status tracking

### Metrics (Gelecek)
- **Performance Metrics**: Response time, throughput
- **Error Metrics**: Error rate, error types
- **Business Metrics**: Order count, revenue, vb.

## Deployment

### Frontend
- **Platform**: Vercel
- **Build**: Next.js production build
- **Environment**: Environment variables Vercel'de yönetilir

### Backend Services
- **Platform**: Docker containers (Kubernetes - gelecek)
- **Orchestration**: Docker Compose (development), Kubernetes (production)
- **Scaling**: Horizontal pod autoscaling

### Database
- **Platform**: Neon / Supabase (PostgreSQL)
- **Backup**: Otomatik backup
- **Migrations**: Prisma migrations ile yönetilir

## Development Workflow

### Local Development
1. Docker Compose ile PostgreSQL başlat
2. Database setup script'i çalıştır
3. Servisleri başlat (npm run dev veya script)
4. Frontend'i başlat

### Code Organization
- **Monorepo**: npm workspaces ile monorepo yapısı
- **Shared Packages**: `shared-kernel`, `shared-config`
- **Type Safety**: TypeScript ile tip güvenliği
- **Code Style**: ESLint, Prettier

### Testing Strategy (Gelecek)
- **Unit Tests**: Jest ile unit testler
- **Integration Tests**: API endpoint testleri
- **E2E Tests**: Cypress ile end-to-end testler

## Best Practices

### SOLID Principles
- **Single Responsibility**: Her servis tek sorumluluğa sahip
- **Open/Closed**: Extension için açık, modification için kapalı
- **Liskov Substitution**: Interface'ler doğru kullanılıyor
- **Interface Segregation**: Küçük, odaklanmış interface'ler
- **Dependency Inversion**: Repository pattern ile dependency inversion

### Code Quality
- **TypeScript**: Tip güvenliği
- **Error Handling**: Try-catch blokları ve error logging
- **Validation**: Input validation
- **Documentation**: JSDoc comments

### Security
- **Environment Variables**: Hassas bilgiler .env'de
- **JWT Secrets**: Güçlü secret key'ler
- **CORS**: Cross-origin resource sharing kontrolü
- **Rate Limiting**: API rate limiting (gelecek)

## Gelecek Geliştirmeler

1. **Message Queue**: RabbitMQ/Kafka entegrasyonu
2. **Caching**: Redis entegrasyonu
3. **Monitoring**: ELK Stack veya Prometheus
4. **Testing**: Comprehensive test suite
5. **CI/CD**: GitHub Actions veya GitLab CI
6. **API Gateway**: Kong veya AWS API Gateway
7. **Service Mesh**: Istio (büyük ölçek için)

---

**Geliştirici:** CotNeo  
**Son Güncelleme:** 2025
