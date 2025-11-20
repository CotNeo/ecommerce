# Cart Service Test Script

Write-Host "🧪 Testing Cart Service..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:3003/health -Method GET
    Write-Host "✅ Health Check: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}

# Test 2: Create Cart (via Add to Cart)
Write-Host "`n2. Testing Add to Cart (creates cart)..." -ForegroundColor Yellow
try {
    $sessionId = "test-session-$(Get-Random)"
    $body = @{
        sessionId = $sessionId
        productId = "test-product-id"
        quantity = 2
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri http://localhost:3003/api/v1/cart/items -Method POST -Body $body -ContentType 'application/json'
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✅ Add to Cart Success!" -ForegroundColor Green
    Write-Host "   Cart ID: $($result.id)" -ForegroundColor Gray
    Write-Host "   Items: $($result.items.Count)" -ForegroundColor Gray
    Write-Host "   Total: $($result.totalAmount)" -ForegroundColor Gray
    $global:cartId = $result.id
    $global:sessionId = $sessionId
} catch {
    Write-Host "❌ Add to Cart Failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
}

# Test 3: Get Cart
if ($global:sessionId) {
    Write-Host "`n3. Testing Get Cart..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3003/api/v1/cart?sessionId=$global:sessionId" -Method GET
        $result = $response.Content | ConvertFrom-Json
        Write-Host "✅ Get Cart Success!" -ForegroundColor Green
        Write-Host "   Cart ID: $($result.id)" -ForegroundColor Gray
        Write-Host "   Items: $($result.items.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Get Cart Failed: $_" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Response: $responseBody" -ForegroundColor Red
        }
    }
}

Write-Host "`n✨ Tests completed!" -ForegroundColor Cyan

