# Order Service Test Script

Write-Host "🧪 Testing Order Service..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:3004/health -Method GET
    Write-Host "✅ Health Check: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}

# Test 2: Create Order Draft
Write-Host "`n2. Testing Create Order Draft..." -ForegroundColor Yellow
try {
    $body = @{
        userId = "test-user-id"
        shippingAddressId = "test-address-1"
        billingAddressId = "test-address-1"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri http://localhost:3004/api/v1/orders/draft -Method POST -Body $body -ContentType 'application/json'
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✅ Create Order Draft Success!" -ForegroundColor Green
    Write-Host "   Order ID: $($result.id)" -ForegroundColor Gray
    Write-Host "   Status: $($result.status)" -ForegroundColor Gray
    Write-Host "   Total: $($result.totalAmount) $($result.currency)" -ForegroundColor Gray
    $global:orderId = $result.id
    $global:userId = "test-user-id"
} catch {
    Write-Host "❌ Create Order Draft Failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
}

# Test 3: Get Orders by User ID
if ($global:userId) {
    Write-Host "`n3. Testing Get Orders by User ID..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3004/api/v1/orders?userId=$global:userId" -Method GET
        $result = $response.Content | ConvertFrom-Json
        Write-Host "✅ Get Orders Success!" -ForegroundColor Green
        Write-Host "   Orders found: $($result.Count)" -ForegroundColor Gray
        if ($result.Count -gt 0) {
            Write-Host "   First order ID: $($result[0].id)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ Get Orders Failed: $_" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Response: $responseBody" -ForegroundColor Red
        }
    }
}

# Test 4: Get Order by ID
if ($global:orderId) {
    Write-Host "`n4. Testing Get Order by ID..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3004/api/v1/orders/$global:orderId" -Method GET
        $result = $response.Content | ConvertFrom-Json
        Write-Host "✅ Get Order by ID Success!" -ForegroundColor Green
        Write-Host "   Order ID: $($result.id)" -ForegroundColor Gray
        Write-Host "   Status: $($result.status)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Get Order by ID Failed: $_" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Response: $responseBody" -ForegroundColor Red
        }
    }
}

Write-Host "`n✨ Tests completed!" -ForegroundColor Cyan

