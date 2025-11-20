# Catalog Service Test Script

Write-Host "🧪 Testing Catalog Service..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:3002/health -Method GET
    Write-Host "✅ Health Check: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}

# Test 2: Get Products
Write-Host "`n2. Testing Get Products..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/v1/products?limit=5" -Method GET
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✅ Get Products Success!" -ForegroundColor Green
    Write-Host "   Products found: $($result.Count)" -ForegroundColor Gray
    if ($result.Count -gt 0) {
        Write-Host "   First product: $($result[0].name)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Get Products Failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
}

# Test 3: Get Product by Slug
Write-Host "`n3. Testing Get Product by Slug..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/v1/products/iphone-15-pro" -Method GET
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✅ Get Product by Slug Success!" -ForegroundColor Green
    Write-Host "   Product: $($result.name)" -ForegroundColor Gray
    Write-Host "   Price: $($result.price) $($result.currency)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Get Product by Slug Failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n✨ Tests completed!" -ForegroundColor Cyan

