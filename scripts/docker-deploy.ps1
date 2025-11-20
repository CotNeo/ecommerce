# Docker Deployment Script

Write-Host "🐳 Docker Deployment Başlatılıyor..." -ForegroundColor Cyan

# Check if .env.prod exists
if (-not (Test-Path "infra\.env.prod")) {
    Write-Host "❌ infra\.env.prod dosyası bulunamadı!" -ForegroundColor Red
    Write-Host "📝 Lütfen infra\.env.prod dosyasını oluşturun" -ForegroundColor Yellow
    Write-Host "`nÖrnek içerik:" -ForegroundColor Cyan
    Write-Host @"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce
POSTGRES_PORT=5432
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-for-development
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-long-for-development
PAYMENT_PROVIDER_API_KEY=your-payment-provider-api-key
PAYMENT_PROVIDER_SECRET_KEY=your-payment-provider-secret-key
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
NEXT_PUBLIC_API_URL=http://localhost:3000
WEB_PORT=3000
"@ -ForegroundColor Gray
    exit 1
}

Write-Host "✅ .env.prod dosyası bulundu" -ForegroundColor Green

# Build images
Write-Host "`n📦 Docker image'ları build ediliyor..." -ForegroundColor Yellow
Write-Host "⏳ Bu işlem 5-10 dakika sürebilir..." -ForegroundColor Gray

docker-compose -f infra\docker-compose.prod.yml --env-file infra\.env.prod build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Build hatası!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Build tamamlandı!" -ForegroundColor Green

# Start services
Write-Host "`n🚀 Servisler başlatılıyor..." -ForegroundColor Yellow

docker-compose -f infra\docker-compose.prod.yml --env-file infra\.env.prod up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Servisler başlatılamadı!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Servisler başlatıldı!" -ForegroundColor Green

# Wait for services to be ready
Write-Host "`n⏳ Servislerin hazır olması bekleniyor..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service status
Write-Host "`n📊 Servis Durumu:" -ForegroundColor Cyan
docker-compose -f infra\docker-compose.prod.yml ps

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ DEPLOYMENT TAMAMLANDI!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n🌐 Erişim URL'leri:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Auth Service: http://localhost:3001" -ForegroundColor White
Write-Host "   Catalog Service: http://localhost:3002" -ForegroundColor White
Write-Host "   Cart Service: http://localhost:3003" -ForegroundColor White
Write-Host "   Order Service: http://localhost:3004" -ForegroundColor White
Write-Host "   Payment Service: http://localhost:3005" -ForegroundColor White
Write-Host "   Notification Service: http://localhost:3006" -ForegroundColor White

Write-Host "`n📝 Sonraki Adımlar:" -ForegroundColor Yellow
Write-Host "   1. Database migration'ları çalıştırın:" -ForegroundColor White
Write-Host "      docker-compose -f infra\docker-compose.prod.yml exec auth-service npx prisma migrate deploy" -ForegroundColor Gray
Write-Host "   2. Seed data yükleyin (opsiyonel):" -ForegroundColor White
Write-Host "      docker-compose -f infra\docker-compose.prod.yml exec auth-service npm run prisma:seed" -ForegroundColor Gray
Write-Host "`n📚 Detaylı bilgi için: DOCKER_DEPLOYMENT.md" -ForegroundColor Cyan

