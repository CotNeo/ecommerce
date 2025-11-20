# Vercel Deployment Setup Guide

**Geliştirici:** CotNeo

## Hızlı Başlangıç

### 1. Vercel'de Proje Oluşturma

1. **Vercel Dashboard'a gidin:**
   - https://vercel.com/dashboard
   - GitHub ile giriş yapın

2. **"Add New Project" butonuna tıklayın**

3. **Repository'yi seçin:**
   - `CotNeo/ecommerce` repository'sini seçin

4. **Project Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web` (önemli!)
   - **Build Command:** (otomatik algılanacak, gerekirse manuel ayarlayın)
   - **Output Directory:** `.next` (otomatik)
   - **Install Command:** `cd ../.. && npm install`

### 2. Environment Variables

Vercel Dashboard > Project Settings > Environment Variables bölümüne gidin ve aşağıdaki değişkenleri ekleyin:

#### Production Variables

```
AUTH_SERVICE_URL=https://your-auth-service-url.com
CATALOG_SERVICE_URL=https://your-catalog-service-url.com
CART_SERVICE_URL=https://your-cart-service-url.com
ORDER_SERVICE_URL=https://your-order-service-url.com
PAYMENT_SERVICE_URL=https://your-payment-service-url.com
NOTIFICATION_SERVICE_URL=https://your-notification-service-url.com
NEXT_PUBLIC_API_URL=https://your-frontend.vercel.app
```

**Not:** Backend servislerinizi ayrı olarak deploy etmeniz gerekecek (Railway, Render, vb.)

### 3. GitHub Secrets (CI/CD için)

GitHub repository'nizde Settings > Secrets and variables > Actions bölümüne gidin:

1. **VERCEL_TOKEN:**
   - Vercel Dashboard > Settings > Tokens
   - "Create Token" butonuna tıklayın
   - Token'ı kopyalayın ve GitHub Secrets'a ekleyin

2. **VERCEL_ORG_ID:**
   - Vercel Dashboard > Settings > General
   - Team ID'yi kopyalayın

3. **VERCEL_PROJECT_ID:**
   - Vercel Dashboard > Project Settings > General
   - Project ID'yi kopyalayın

### 4. İlk Deploy

Vercel otomatik olarak ilk deploy'u yapacaktır. Alternatif olarak:

```bash
# Vercel CLI ile
cd apps/web
vercel
```

## Monorepo Yapılandırması

Vercel monorepo'ları destekler. Root directory olarak `apps/web` seçildiğinde:

- Vercel otomatik olarak root'tan `npm install` çalıştırır
- Shared packages'lar build edilir
- Frontend deploy edilir

## Build Süreci

Vercel build süreci şu adımları izler:

1. **Install:** Root'tan `npm install` çalıştırır
2. **Build Shared Packages:**
   - `packages/shared-kernel` build edilir
   - `packages/shared-config` build edilir
3. **Build Frontend:**
   - `apps/web` build edilir
   - Next.js production build oluşturulur

## Troubleshooting

### Build Hatası: "Module not found"

**Çözüm:**
- Shared packages'ların build edildiğinden emin olun
- Root'tan `npm install` çalıştığını kontrol edin
- `package.json` workspace yapılandırmasını kontrol edin

### Build Hatası: "Environment variable not found"

**Çözüm:**
- Vercel Dashboard'da environment variables'ları kontrol edin
- Variable isimlerinin doğru olduğundan emin olun
- Production, Preview ve Development için ayrı ayrı ekleyin

### Build Süresi Çok Uzun

**Çözüm:**
- Build cache'i kullanın
- Unnecessary dependencies'leri kaldırın
- Turbo build cache'i kullanın

## Custom Domain

1. Vercel Dashboard > Project Settings > Domains
2. Domain'inizi ekleyin
3. DNS kayıtlarını yapılandırın:
   - A Record: `@` → Vercel IP
   - CNAME: `www` → `cname.vercel-dns.com`

## Performance

### Image Optimization
- Next.js Image component'i otomatik olarak optimize eder
- Vercel CDN'de cache'lenir

### Caching
- Static assets otomatik cache'lenir
- API routes için cache headers ekleyin

## Monitoring

Vercel Dashboard'da:
- **Analytics:** Performance metrics
- **Logs:** Real-time logs
- **Deployments:** Deployment history

## Rollback

1. Vercel Dashboard > Deployments
2. Geri dönmek istediğiniz deployment'ı seçin
3. "Promote to Production" butonuna tıklayın

---

**Geliştirici:** CotNeo  
**Son Güncelleme:** 2025

