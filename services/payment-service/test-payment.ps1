# Payment Service Test Script

Write-Host "🧪 Testing Payment Service..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:3005/health -Method GET
    Write-Host "✅ Health Check: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}

# Test 2: Create Payment Intent
Write-Host "`n2. Testing Create Payment Intent..." -ForegroundColor Yellow
try {
    $body = @{
        orderId = "test-order-id"
        amount = 100.50
        currency = "TRY"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri http://localhost:3005/api/v1/payments/create-intent -Method POST -Body $body -ContentType 'application/json'
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✅ Create Payment Intent Success!" -ForegroundColor Green
    Write-Host "   Payment Intent ID: $($result.paymentIntentId)" -ForegroundColor Gray
    Write-Host "   Client Secret: $($result.clientSecret.Substring(0, 20))..." -ForegroundColor Gray
    $global:paymentIntentId = $result.paymentIntentId
} catch {
    Write-Host "❌ Create Payment Intent Failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n✨ Tests completed!" -ForegroundColor Cyan

