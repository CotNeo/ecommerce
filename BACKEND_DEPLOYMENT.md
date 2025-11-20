# Backend Servisleri Deployment Rehberi

Bu doküman, backend servislerinin nasıl deploy edileceğini ve URL'lerin nasıl alınacağını açıklar.

**Geliştirici:** CotNeo

## Genel Bakış

Frontend (Next.js) Vercel'de deploy edilirken, backend servisleri ayrı platformlarda deploy edilmelidir. Her servis için bir URL alacaksınız ve bu URL'leri Vercel environment variables'larına ekleyeceksiniz.

## URL'lerin Kaynağı

### 1. NEXT_PUBLIC_API_URL (Frontend URL)

**Kaynak:** Vercel otomatik olarak verir

Vercel'de frontend'i deploy ettiğinizde, otomatik olarak bir URL alırsınız:
- Format: `https://your-project-name.vercel.app`
- Örnek: `https://ecommerce-cotneo.vercel.app`

**Nasıl Bulunur:**
1. Vercel Dashboard > Your Project
2. Deployments sekmesinde
3. Her deployment'ın yanında URL görünür
4. Production URL'i kopyalayın

### 2. Backend Service URL'leri

Backend servislerinizi deploy ettiğinizde, her servis için bir URL alırsınız. Seçenekler:

## Deployment Platformları

### Seçenek 1: Railway (Önerilen - Kolay ve Hızlı)

Railway, mikroservisler için mükemmel bir platformdur.

#### Kurulum

1. **Railway'a gidin:** https://railway.app
2. **GitHub ile giriş yapın**
3. **"New Project" butonuna tıklayın**
4. **"Deploy from GitHub repo" seçin**
5. **Repository'yi seçin**

#### Her Servis İçin

Her servis için ayrı bir Railway projesi oluşturun:

**Auth Service:**
1. New Project > Deploy from GitHub
2. Repository: `CotNeo/ecommerce`
3. Root Directory: `services/auth-service`
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start` veya `node dist/index.js`
6. Environment Variables ekleyin:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   PORT=3001
   ```
7. Deploy edin
8. **URL'i alın:** Railway otomatik olarak bir URL verir (örn: `https://auth-service-production.up.railway.app`)

**Diğer Servisler İçin Aynı İşlemi Tekrarlayın:**
- Catalog Service: Root Directory: `services/catalog-service`
- Cart Service: Root Directory: `services/cart-service`
- Order Service: Root Directory: `services/order-service`
- Payment Service: Root Directory: `services/payment-service`
- Notification Service: Root Directory: `services/notification-service`

**Her servis için URL formatı:**
- `https://catalog-service-production.up.railway.app`
- `https://cart-service-production.up.railway.app`
- vb.

### Seçenek 2: Render

Render, backend servisleri için uygun bir alternatiftir.

#### Kurulum

1. **Render'a gidin:** https://render.com
2. **GitHub ile giriş yapın**
3. **"New +" > "Web Service"**
4. **Repository'yi bağlayın**

#### Her Servis İçin

**Auth Service:**
1. New Web Service
2. Repository: `CotNeo/ecommerce`
3. Root Directory: `services/auth-service`
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Environment Variables ekleyin
7. Deploy edin
8. **URL'i alın:** Render otomatik olarak bir URL verir (örn: `https://auth-service.onrender.com`)

### Seçenek 3: Vercel Serverless Functions

Vercel'de backend servislerini serverless functions olarak deploy edebilirsiniz.

**Not:** Bu yöntem daha karmaşıktır ve her servis için ayrı Vercel projesi gerektirir.

### Seçenek 4: DigitalOcean App Platform

DigitalOcean, mikroservisler için uygun bir platformdur.

1. **DigitalOcean'a gidin:** https://www.digitalocean.com
2. **App Platform'u kullanın**
3. Her servis için ayrı app oluşturun

### Seçenek 5: AWS / Google Cloud / Azure

Enterprise seviyesi için cloud provider'ları kullanabilirsiniz.

## Database Deployment

Backend servisleriniz için production database'e ihtiyacınız var.

### Seçenekler:

1. **Neon (Önerilen):** https://neon.tech
   - PostgreSQL
   - Ücretsiz tier mevcut
   - Connection string alın: `postgresql://user:password@host/database?schema=auth`

2. **Supabase:** https://supabase.com
   - PostgreSQL
   - Ücretsiz tier mevcut

3. **Railway Database:**
   - Railway'da PostgreSQL database oluşturun
   - Connection string otomatik olarak verilir

4. **Render Database:**
   - Render'da PostgreSQL database oluşturun

## Adım Adım Deployment

### 1. Database Kurulumu

**Neon ile:**

1. https://neon.tech adresine gidin
2. Hesap oluşturun
3. "Create Project" butonuna tıklayın
4. Database oluşturun
5. Connection string'i kopyalayın
6. Her servis için ayrı schema kullanın:
   - `?schema=auth` (Auth Service için)
   - `?schema=catalog` (Catalog Service için)
   - vb.

### 2. Backend Servislerini Deploy Etme

**Railway ile (Örnek - Auth Service):**

1. Railway Dashboard > New Project
2. Deploy from GitHub repo
3. Repository: `CotNeo/ecommerce`
4. **Root Directory:** `services/auth-service`
5. **Build Command:** `npm install && npm run build`
6. **Start Command:** `npm start`
7. **Environment Variables:**
   ```
   DATABASE_URL=postgresql://user:password@host/database?schema=auth
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-long
   PORT=3001
   NODE_ENV=production
   ```
8. Deploy edin
9. **URL'i kopyalayın:** Railway otomatik olarak bir URL verir

**Diğer servisler için aynı işlemi tekrarlayın** (Root Directory'yi değiştirerek)

### 3. Vercel Environment Variables'ları Güncelleme

Backend servislerinizin URL'lerini aldıktan sonra:

1. Vercel Dashboard > Your Project > Settings > Environment Variables
2. Aşağıdaki değişkenleri ekleyin/güncelleyin:

```
AUTH_SERVICE_URL=https://auth-service-production.up.railway.app
CATALOG_SERVICE_URL=https://catalog-service-production.up.railway.app
CART_SERVICE_URL=https://cart-service-production.up.railway.app
ORDER_SERVICE_URL=https://order-service-production.up.railway.app
PAYMENT_SERVICE_URL=https://payment-service-production.up.railway.app
NOTIFICATION_SERVICE_URL=https://notification-service-production.up.railway.app
NEXT_PUBLIC_API_URL=https://your-frontend.vercel.app
```

**Not:** `NEXT_PUBLIC_API_URL` Vercel'de frontend deploy edildikten sonra otomatik olarak alınır.

### 4. Database Migration

Production database'de migration'ları çalıştırın:

**Her servis için:**

```bash
# Railway CLI ile (veya SSH ile)
cd services/auth-service
npx prisma migrate deploy
npx prisma db seed  # Eğer seed varsa
```

## Development vs Production URL'leri

### Development (Local)

```env
AUTH_SERVICE_URL=http://localhost:3001
CATALOG_SERVICE_URL=http://localhost:3002
CART_SERVICE_URL=http://localhost:3003
ORDER_SERVICE_URL=http://localhost:3004
PAYMENT_SERVICE_URL=http://localhost:3005
NOTIFICATION_SERVICE_URL=http://localhost:3006
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Production

```env
AUTH_SERVICE_URL=https://auth-service-production.up.railway.app
CATALOG_SERVICE_URL=https://catalog-service-production.up.railway.app
CART_SERVICE_URL=https://cart-service-production.up.railway.app
ORDER_SERVICE_URL=https://order-service-production.up.railway.app
PAYMENT_SERVICE_URL=https://payment-service-production.up.railway.app
NOTIFICATION_SERVICE_URL=https://notification-service-production.up.railway.app
NEXT_PUBLIC_API_URL=https://your-frontend.vercel.app
```

## URL Formatları

### Railway
- Format: `https://{service-name}-{environment}.up.railway.app`
- Örnek: `https://auth-service-production.up.railway.app`

### Render
- Format: `https://{service-name}.onrender.com`
- Örnek: `https://auth-service.onrender.com`

### Vercel
- Format: `https://{project-name}.vercel.app`
- Örnek: `https://ecommerce-cotneo.vercel.app`

## Örnek Deployment Senaryosu

### Senaryo: Railway Kullanarak

1. **Database (Neon):**
   - Neon'da database oluştur
   - Connection string: `postgresql://user:pass@host/db?schema=auth`

2. **Auth Service (Railway):**
   - Railway'da deploy et
   - URL: `https://auth-service-production.up.railway.app`

3. **Catalog Service (Railway):**
   - Railway'da deploy et
   - URL: `https://catalog-service-production.up.railway.app`

4. **Diğer Servisler:**
   - Aynı şekilde deploy et
   - URL'leri al

5. **Frontend (Vercel):**
   - Vercel'de deploy et
   - URL: `https://ecommerce-cotneo.vercel.app`

6. **Vercel Environment Variables:**
   ```
   AUTH_SERVICE_URL=https://auth-service-production.up.railway.app
   CATALOG_SERVICE_URL=https://catalog-service-production.up.railway.app
   CART_SERVICE_URL=https://cart-service-production.up.railway.app
   ORDER_SERVICE_URL=https://order-service-production.up.railway.app
   PAYMENT_SERVICE_URL=https://payment-service-production.up.railway.app
   NOTIFICATION_SERVICE_URL=https://notification-service-production.up.railway.app
   NEXT_PUBLIC_API_URL=https://ecommerce-cotneo.vercel.app
   ```

## Troubleshooting

### URL Bulamıyorum

**Railway:**
- Dashboard > Your Service > Settings > Domains
- Veya Deployments sekmesinde URL görünür

**Render:**
- Dashboard > Your Service > Settings > Custom Domain
- Varsayılan URL otomatik olarak verilir

**Vercel:**
- Dashboard > Your Project > Deployments
- Her deployment'ın yanında URL görünür

### CORS Hatası

Backend servislerinizde CORS ayarlarını yapın:

```typescript
// Her serviste
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend.vercel.app',
  credentials: true
}));
```

### Connection Timeout

- Database connection string'in doğru olduğundan emin olun
- Firewall ayarlarını kontrol edin
- Database'in public erişime açık olduğundan emin olun

## Özet

1. **Frontend URL (NEXT_PUBLIC_API_URL):** Vercel otomatik verir
2. **Backend Service URL'leri:** Railway/Render/Vercel'de deploy ettiğinizde alırsınız
3. **Her servis için ayrı URL:** Her servis ayrı deploy edilir
4. **Environment Variables:** Vercel Dashboard'da ekleyin

---

**Geliştirici:** CotNeo  
**Son Güncelleme:** 2025

