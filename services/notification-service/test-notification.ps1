# Notification Service Test Script

Write-Host "🧪 Testing Notification Service..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:3006/health -Method GET
    Write-Host "✅ Health Check: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}

# Test 2: Send Email
Write-Host "`n2. Testing Send Email..." -ForegroundColor Yellow
try {
    $body = @{
        to = "test@example.com"
        subject = "Test Email"
        template = "order_created"
        data = @{
            orderId = "12345"
            customerName = "Test User"
        }
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri http://localhost:3006/api/v1/notifications/send-email -Method POST -Body $body -ContentType 'application/json'
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✅ Send Email Success!" -ForegroundColor Green
    Write-Host "   Result: $($result | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Send Email Failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n✨ Tests completed!" -ForegroundColor Cyan

