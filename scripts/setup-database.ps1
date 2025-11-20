# Database setup script for all services (PowerShell)

$ErrorActionPreference = "Stop"

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir

Write-Host "🚀 Setting up databases for all services..." -ForegroundColor Cyan
Write-Host "Root directory: $RootDir" -ForegroundColor Gray

function Setup-Service {
    param(
        [string]$ServiceName,
        [string]$SchemaName,
        [bool]$HasSeed
    )

    Write-Host "`n📦 Setting up $ServiceName..." -ForegroundColor Blue
    $ServicePath = Join-Path $RootDir "services\$ServiceName"
    
    if (-not (Test-Path $ServicePath)) {
        Write-Host "  ❌ Service path not found: $ServicePath" -ForegroundColor Red
        return
    }

    Push-Location $ServicePath

    try {
        # Generate Prisma Client
        Write-Host "  📦 Generating Prisma Client..." -ForegroundColor Yellow
        npm run prisma:generate
        if ($LASTEXITCODE -ne 0) {
            throw "Prisma generate failed"
        }

        # Run migrations
        Write-Host "  🔄 Running migrations..." -ForegroundColor Yellow
        npm run prisma:migrate -- --name init
        if ($LASTEXITCODE -ne 0) {
            throw "Prisma migrate failed"
        }

        # Run seed if available
        if ($HasSeed) {
            Write-Host "  🌱 Seeding database..." -ForegroundColor Yellow
            npm run prisma:seed
            if ($LASTEXITCODE -ne 0) {
                Write-Host "  ⚠️  Seed failed, but continuing..." -ForegroundColor Yellow
            }
        }

        Write-Host "✅ $ServiceName setup completed!" -ForegroundColor Green
    }
    catch {
        Write-Host "  ❌ Error setting up $ServiceName : $_" -ForegroundColor Red
    }
    finally {
        Pop-Location
    }
}

# Setup all services
Setup-Service "auth-service" "auth" $true
Setup-Service "catalog-service" "catalog" $true
Setup-Service "cart-service" "cart" $false
Setup-Service "order-service" "orders" $false
Setup-Service "payment-service" "payments" $false
Setup-Service "notification-service" "notifications" $true

Write-Host "`n🎉 All databases setup completed!" -ForegroundColor Green

