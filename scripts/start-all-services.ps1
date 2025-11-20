# Start All Services Script

Write-Host "🚀 Starting all services..." -ForegroundColor Cyan

# Function to start a service
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [int]$Port
    )
    
    Write-Host "`n📦 Starting $ServiceName on port $Port..." -ForegroundColor Yellow
    
    # Check if port is already in use
    $portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Host "⚠️  Port $Port is already in use. Skipping $ServiceName" -ForegroundColor Yellow
        return
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ServicePath'; npm run dev" -WindowStyle Minimized
    Start-Sleep -Seconds 2
}

# Start services
Start-Service -ServiceName "Auth Service" -ServicePath "$PSScriptRoot\..\services\auth-service" -Port 3001
Start-Service -ServiceName "Catalog Service" -ServicePath "$PSScriptRoot\..\services\catalog-service" -Port 3002
Start-Service -ServiceName "Cart Service" -ServicePath "$PSScriptRoot\..\services\cart-service" -Port 3003
Start-Service -ServiceName "Order Service" -ServicePath "$PSScriptRoot\..\services\order-service" -Port 3004
Start-Service -ServiceName "Payment Service" -ServicePath "$PSScriptRoot\..\services\payment-service" -Port 3005
Start-Service -ServiceName "Notification Service" -ServicePath "$PSScriptRoot\..\services\notification-service" -Port 3006

Write-Host "`n⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "`n✅ All services started!" -ForegroundColor Green
Write-Host "`nFrontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  - Auth Service: http://localhost:3001" -ForegroundColor Gray
Write-Host "  - Catalog Service: http://localhost:3002" -ForegroundColor Gray
Write-Host "  - Cart Service: http://localhost:3003" -ForegroundColor Gray
Write-Host "  - Order Service: http://localhost:3004" -ForegroundColor Gray
Write-Host "  - Payment Service: http://localhost:3005" -ForegroundColor Gray
Write-Host "  - Notification Service: http://localhost:3006" -ForegroundColor Gray

