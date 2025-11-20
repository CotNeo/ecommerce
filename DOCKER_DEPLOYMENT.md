# Docker Deployment Rehberi

Bu doküman, tüm uygulamayı Docker ile nasıl deploy edeceğinizi açıklar.

**Geliştirici:** CotNeo

## 🐳 Docker ile Deployment

Docker kullanarak tüm uygulamayı (frontend + backend servisleri + database) tek seferde deploy edebilirsiniz. Bu çok daha kolay ve pratik!

## 📋 Ön Gereksinimler

- Docker >= 20.10
- Docker Compose >= 2.0
- Git

## 🚀 Hızlı Başlangıç

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/CotNeo/ecommerce.git
cd ecommerce
```

### 2. Environment Variables Dosyası Oluşturun

`infra/.env.prod` dosyası oluşturun:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=ecommerce
POSTGRES_PORT=5432

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-long

# Payment Provider
PAYMENT_PROVIDER_API_KEY=your-payment-provider-api-key
PAYMENT_PROVIDER_SECRET_KEY=your-payment-provider-secret-key

# SMTP (Email)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000
WEB_PORT=3000
```

### 3. Docker Compose ile Başlatın

```bash
cd infra
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### 4. Database Migration'ları Çalıştırın

```bash
# Auth Service
docker-compose -f docker-compose.prod.yml exec auth-service npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml exec auth-service npm run prisma:seed

# Catalog Service
docker-compose -f docker-compose.prod.yml exec catalog-service npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml exec catalog-service npm run prisma:seed

# Cart Service
docker-compose -f docker-compose.prod.yml exec cart-service npx prisma migrate deploy

# Order Service
docker-compose -f docker-compose.prod.yml exec order-service npx prisma migrate deploy

# Payment Service
docker-compose -f docker-compose.prod.yml exec payment-service npx prisma migrate deploy

# Notification Service
docker-compose -f docker-compose.prod.yml exec notification-service npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml exec notification-service npm run prisma:seed
```

### 5. Uygulamaya Erişin

- **Frontend:** http://localhost:3000
- **Auth Service:** http://localhost:3001
- **Catalog Service:** http://localhost:3002
- **Cart Service:** http://localhost:3003
- **Order Service:** http://localhost:3004
- **Payment Service:** http://localhost:3005
- **Notification Service:** http://localhost:3006

## 📦 Docker Compose Komutları

### Tüm Servisleri Başlat

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Servisleri Durdur

```bash
docker-compose -f docker-compose.prod.yml down
```

### Servisleri Yeniden Build Et

```bash
docker-compose -f docker-compose.prod.yml build --no-cache
```

### Logları Görüntüle

```bash
# Tüm servisler
docker-compose -f docker-compose.prod.yml logs -f

# Belirli bir servis
docker-compose -f docker-compose.prod.yml logs -f web
```

### Servis Durumunu Kontrol Et

```bash
docker-compose -f docker-compose.prod.yml ps
```

## 🌐 Production Deployment

### Railway ile Deploy

Railway, Docker Compose dosyalarını destekler:

1. **Railway'a gidin:** https://railway.app
2. **New Project > Deploy from GitHub repo**
3. **Repository'yi seçin:** `CotNeo/ecommerce`
4. **Root Directory:** `infra`
5. **Docker Compose File:** `docker-compose.prod.yml`
6. **Environment Variables ekleyin** (Railway Dashboard'dan)
7. **Deploy edin**

Railway otomatik olarak:
- Tüm servisleri build eder
- Container'ları başlatır
- Network'ü yapılandırır
- Public URL'ler verir

### Render ile Deploy

Render Docker Compose'u destekler:

1. **Render'a gidin:** https://render.com
2. **New > Blueprint**
3. **GitHub repository'yi bağlayın**
4. **Docker Compose file:** `infra/docker-compose.prod.yml`
5. **Environment Variables ekleyin**
6. **Deploy edin**

### DigitalOcean App Platform

DigitalOcean App Platform Docker Compose'u destekler:

1. **DigitalOcean'a gidin:** https://www.digitalocean.com
2. **Apps > Create App**
3. **GitHub repository'yi bağlayın**
4. **Docker Compose file seçin**
5. **Deploy edin**

### AWS / Google Cloud / Azure

Cloud provider'lar için:

1. **Docker Compose'u Kubernetes'e çevirin:**
   ```bash
   # Kompose kullanarak
   kompose convert
   ```

2. **Kubernetes cluster'da deploy edin**

## 🔧 Environment Variables

Production'da environment variables'ları güvenli bir şekilde yönetin:

### Railway

Railway Dashboard > Your Project > Variables

### Render

Render Dashboard > Your Blueprint > Environment

### Docker Compose

`.env.prod` dosyasını kullanın (Git'e commit etmeyin!)

## 📊 Monitoring

### Health Checks

Her servis `/health` endpoint'ine sahiptir:

```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
# vb.
```

### Logs

```bash
# Tüm loglar
docker-compose -f docker-compose.prod.yml logs -f

# Belirli servis
docker-compose -f docker-compose.prod.yml logs -f auth-service
```

## 🔒 Security

### Secrets Management

- Environment variables'ları `.env.prod` dosyasında saklayın
- `.env.prod` dosyasını `.gitignore`'a ekleyin
- Production'da secrets management servisi kullanın (AWS Secrets Manager, HashiCorp Vault, vb.)

### Database Security

- Güçlü şifreler kullanın
- Database'e sadece internal network'ten erişim sağlayın
- SSL/TLS kullanın (production'da)

## 🚀 Scaling

### Horizontal Scaling

Docker Compose ile scaling:

```bash
# Web servisini 3 instance'a scale et
docker-compose -f docker-compose.prod.yml up -d --scale web=3
```

### Load Balancing

Nginx veya Traefik kullanarak load balancing ekleyin.

## 📝 Troubleshooting

### Container Başlamıyor

```bash
# Logları kontrol et
docker-compose -f docker-compose.prod.yml logs [service-name]

# Container'ı yeniden başlat
docker-compose -f docker-compose.prod.yml restart [service-name]
```

### Database Connection Hatası

```bash
# Database'in çalıştığını kontrol et
docker-compose -f docker-compose.prod.yml ps postgres

# Database'e bağlan
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d ecommerce
```

### Build Hatası

```bash
# Cache'i temizle ve yeniden build et
docker-compose -f docker-compose.prod.yml build --no-cache
```

## 🎯 Avantajlar

✅ **Tek Komut:** Tüm uygulamayı tek komutla deploy edin  
✅ **Kolay Yönetim:** Docker Compose ile kolay yönetim  
✅ **Tutarlılık:** Development ve production aynı ortam  
✅ **Hızlı Deployment:** Railway/Render gibi platformlarda otomatik deploy  
✅ **Kolay Scaling:** Container'ları kolayca scale edebilirsiniz  

## 📚 Daha Fazla Bilgi

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)

---

**Geliştirici:** CotNeo  
**Son Güncelleme:** 2025

