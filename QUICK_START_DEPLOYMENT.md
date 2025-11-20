# Hızlı Deployment Başlangıç Rehberi

**Geliştirici:** CotNeo

## 🚀 URL'leri Nasıl Alırsınız?

### 1. Frontend URL (NEXT_PUBLIC_API_URL)

✅ **Vercel otomatik olarak verir!**

1. Vercel'de frontend'i deploy edin
2. Vercel Dashboard > Your Project > Deployments
3. URL'i kopyalayın: `https://your-project.vercel.app`

### 2. Backend Service URL'leri

Backend servislerinizi deploy etmeniz gerekiyor. En kolay yöntem:

#### Railway Kullanarak (Önerilen)

1. **Railway'a gidin:** https://railway.app
2. **GitHub ile giriş yapın**
3. **Her servis için:**
   - New Project > Deploy from GitHub
   - Repository: `CotNeo/ecommerce`
   - **Root Directory:** `services/auth-service` (her servis için değiştirin)
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables ekleyin (DATABASE_URL, JWT_SECRET, vb.)
   - Deploy edin
   - **URL'i kopyalayın:** Railway otomatik olarak verir

**Örnek URL'ler:**
- Auth Service: `https://auth-service-production.up.railway.app`
- Catalog Service: `https://catalog-service-production.up.railway.app`
- Cart Service: `https://cart-service-production.up.railway.app`
- Order Service: `https://order-service-production.up.railway.app`
- Payment Service: `https://payment-service-production.up.railway.app`
- Notification Service: `https://notification-service-production.up.railway.app`

### 3. Vercel Environment Variables

Tüm URL'leri aldıktan sonra:

1. Vercel Dashboard > Your Project > Settings > Environment Variables
2. Aşağıdakileri ekleyin:

```
AUTH_SERVICE_URL=https://auth-service-production.up.railway.app
CATALOG_SERVICE_URL=https://catalog-service-production.up.railway.app
CART_SERVICE_URL=https://cart-service-production.up.railway.app
ORDER_SERVICE_URL=https://order-service-production.up.railway.app
PAYMENT_SERVICE_URL=https://payment-service-production.up.railway.app
NOTIFICATION_SERVICE_URL=https://notification-service-production.up.railway.app
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
```

## 📋 Adım Adım

### Adım 1: Database Oluştur (Neon)

1. https://neon.tech → Hesap oluştur
2. Create Project
3. Connection string'i kopyala
4. Her servis için ayrı schema kullan: `?schema=auth`, `?schema=catalog`, vb.

### Adım 2: Backend Servislerini Deploy Et (Railway)

Her servis için:

1. Railway > New Project > Deploy from GitHub
2. Root Directory: `services/{service-name}`
3. Environment Variables ekle
4. Deploy et
5. URL'i kopyala

### Adım 3: Frontend'i Deploy Et (Vercel)

1. Vercel > New Project
2. Repository: `CotNeo/ecommerce`
3. Root Directory: `apps/web`
4. Environment Variables ekle (yukarıdaki URL'ler)
5. Deploy et
6. URL'i kopyala

### Adım 4: Environment Variables'ı Güncelle

Vercel'de tüm URL'leri ekleyin ve redeploy edin.

## 🎯 Özet

- **Frontend URL:** Vercel otomatik verir ✅
- **Backend URL'leri:** Railway/Render'da deploy edince alırsınız ✅
- **Detaylı rehber:** `BACKEND_DEPLOYMENT.md` dosyasına bakın

---

**Geliştirici:** CotNeo

