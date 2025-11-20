# Deployment Guide

Bu doküman, uygulamanın Vercel'e deploy edilmesi için gerekli adımları açıklar.

**Geliştirici:** CotNeo

## Vercel Deployment

### Ön Gereksinimler

1. Vercel hesabı oluşturun: https://vercel.com
2. GitHub repository'yi Vercel'e bağlayın
3. Environment variables'ları Vercel'de yapılandırın

### Vercel'de Proje Oluşturma

1. **Vercel Dashboard'a gidin:**
   - https://vercel.com/dashboard

2. **"Add New Project" butonuna tıklayın**

3. **GitHub repository'yi seçin:**
   - `CotNeo/ecommerce` repository'sini seçin

4. **Project Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `cd ../.. && npm install && cd packages/shared-kernel && npm run build && cd ../shared-config && npm run build && cd ../../apps/web && npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `cd ../.. && npm install`

### Environment Variables

Vercel Dashboard'da aşağıdaki environment variables'ları ekleyin:

#### Production Environment Variables

```
AUTH_SERVICE_URL=https://your-auth-service.vercel.app
CATALOG_SERVICE_URL=https://your-catalog-service.vercel.app
CART_SERVICE_URL=https://your-cart-service.vercel.app
ORDER_SERVICE_URL=https://your-order-service.vercel.app
PAYMENT_SERVICE_URL=https://your-payment-service.vercel.app
NOTIFICATION_SERVICE_URL=https://your-notification-service.vercel.app
NEXT_PUBLIC_API_URL=https://your-frontend.vercel.app
```

#### GitHub Secrets (CI/CD için)

GitHub repository settings'de aşağıdaki secrets'ları ekleyin:

- `VERCEL_TOKEN`: Vercel API token'ı (Settings > Tokens)
- `AUTH_SERVICE_URL`: Auth service URL'i
- `CATALOG_SERVICE_URL`: Catalog service URL'i
- `CART_SERVICE_URL`: Cart service URL'i
- `ORDER_SERVICE_URL`: Order service URL'i
- `PAYMENT_SERVICE_URL`: Payment service URL'i
- `NOTIFICATION_SERVICE_URL`: Notification service URL'i

### Vercel CLI ile Deploy

Alternatif olarak Vercel CLI kullanarak deploy edebilirsiniz:

```bash
# Vercel CLI'yi yükleyin
npm install -g vercel

# Login olun
vercel login

# Deploy edin
cd apps/web
vercel

# Production'a deploy
vercel --prod
```

## CI/CD Pipeline

### GitHub Actions

Proje, GitHub Actions ile otomatik CI/CD pipeline'ına sahiptir:

#### CI Pipeline (`.github/workflows/ci.yml`)

Her push ve pull request'te çalışır:
- Lint kontrolü
- Type check
- Build işlemleri

#### Deploy Pipeline (`.github/workflows/deploy-vercel.yml`)

`main` branch'e push edildiğinde çalışır:
- Vercel'e otomatik deploy
- Production build
- Environment variables yönetimi

### Pipeline Adımları

1. **Code Checkout:** Repository'yi checkout eder
2. **Node.js Setup:** Node.js 18 kurulumu
3. **Dependencies Install:** `npm ci` ile bağımlılıkları yükler
4. **Build Shared Packages:** Shared packages'ları build eder
5. **Build Frontend:** Next.js uygulamasını build eder
6. **Deploy to Vercel:** Vercel'e deploy eder

## Backend Services Deployment

Backend servisleri ayrı olarak deploy edilmelidir. Seçenekler:

### 1. Vercel Serverless Functions (Önerilen)

Her servis için ayrı Vercel projesi oluşturun ve serverless functions olarak deploy edin.

### 2. Railway

Railway, mikroservisler için uygun bir platformdur:
- https://railway.app

### 3. Render

Render, backend servisleri için uygun bir alternatiftir:
- https://render.com

### 4. Docker Containers

Docker container'ları olarak deploy edebilirsiniz:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

## Database Deployment

### Production Database

Production ortamı için managed PostgreSQL servisi kullanın:

#### Seçenekler:
1. **Neon** (Önerilen): https://neon.tech
2. **Supabase**: https://supabase.com
3. **AWS RDS**: https://aws.amazon.com/rds
4. **Google Cloud SQL**: https://cloud.google.com/sql

### Database Migration

Production'da migration'ları uygulamak için:

```bash
# Her servis için
cd services/{service-name}
npx prisma migrate deploy
```

## Monitoring

### Vercel Analytics

Vercel Dashboard'da Analytics'i etkinleştirin:
- Performance metrics
- Real User Monitoring (RUM)
- Web Vitals

### Error Tracking

Production'da error tracking için:
- **Sentry**: https://sentry.io
- **LogRocket**: https://logrocket.com
- **Bugsnag**: https://www.bugsnag.com

## Domain Configuration

### Custom Domain

Vercel'de custom domain eklemek için:

1. Vercel Dashboard > Project Settings > Domains
2. Domain'i ekleyin
3. DNS kayıtlarını yapılandırın

### SSL Certificate

Vercel otomatik olarak SSL sertifikası sağlar (Let's Encrypt).

## Performance Optimization

### Image Optimization

Next.js Image component'i kullanın:
- Automatic image optimization
- Lazy loading
- Responsive images

### Caching

- **Static Assets:** Vercel CDN'de cache'lenir
- **API Routes:** Cache headers ekleyin
- **ISR (Incremental Static Regeneration):** Statik sayfalar için

## Security

### Environment Variables

- Hassas bilgileri environment variables'da tutun
- Vercel'de encrypted storage kullanın
- GitHub secrets kullanın

### API Security

- Rate limiting ekleyin
- CORS yapılandırması
- Input validation
- SQL injection koruması (Prisma ile otomatik)

## Troubleshooting

### Build Failures

**Hata:** `Module not found`

**Çözüm:**
- Shared packages'ların build edildiğinden emin olun
- `package.json` dependencies'lerini kontrol edin

**Hata:** `Environment variable not found`

**Çözüm:**
- Vercel Dashboard'da environment variables'ları kontrol edin
- Variable isimlerinin doğru olduğundan emin olun

### Deployment Failures

**Hata:** `Build timeout`

**Çözüm:**
- Build süresini optimize edin
- Unnecessary dependencies'leri kaldırın

**Hata:** `Function timeout`

**Çözüm:**
- API route'larını optimize edin
- Timeout süresini artırın (Vercel Pro plan gerekli)

## Rollback

Vercel'de rollback yapmak için:

1. Vercel Dashboard > Deployments
2. Geri dönmek istediğiniz deployment'ı seçin
3. "Promote to Production" butonuna tıklayın

## Best Practices

1. **Environment Variables:** Production ve preview environment'ları için ayrı değişkenler kullanın
2. **Build Optimization:** Build süresini minimize edin
3. **Error Handling:** Comprehensive error handling ekleyin
4. **Logging:** Structured logging kullanın
5. **Monitoring:** Production'da monitoring ve alerting kurun
6. **Backup:** Database backup'larını düzenli alın
7. **Security:** Security best practices'i takip edin

---

**Geliştirici:** CotNeo  
**Son Güncelleme:** 2025

