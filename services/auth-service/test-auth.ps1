# Auth Service Test Script

Write-Host "🧪 Testing Auth Service..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:3001/health -Method GET
    Write-Host "✅ Health Check: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}

# Test 2: Login with existing user
Write-Host "`n2. Testing Login (existing user)..." -ForegroundColor Yellow
try {
    $body = @{
        email = 'user@ecommerce.com'
        password = 'user123'
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri http://localhost:3001/api/v1/auth/login -Method POST -Body $body -ContentType 'application/json'
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✅ Login Success!" -ForegroundColor Green
    Write-Host "   Access Token: $($result.accessToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host "   User: $($result.user.email)" -ForegroundColor Gray
    $global:accessToken = $result.accessToken
} catch {
    Write-Host "❌ Login Failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
}

# Test 3: Register new user
Write-Host "`n3. Testing Register (new user)..." -ForegroundColor Yellow
try {
    $randomEmail = "test_$(Get-Random)@example.com"
    $body = @{
        email = $randomEmail
        password = 'test123'
        firstName = 'Test'
        lastName = 'User'
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri http://localhost:3001/api/v1/auth/register -Method POST -Body $body -ContentType 'application/json'
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✅ Register Success!" -ForegroundColor Green
    Write-Host "   User ID: $($result.id)" -ForegroundColor Gray
    Write-Host "   Email: $($result.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Register Failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
}

# Test 4: Get Current User (if we have a token)
if ($global:accessToken) {
    Write-Host "`n4. Testing Get Current User..." -ForegroundColor Yellow
    try {
        $headers = @{
            Authorization = "Bearer $global:accessToken"
        }
        $response = Invoke-WebRequest -Uri http://localhost:3001/api/v1/auth/me -Method GET -Headers $headers
        $result = $response.Content | ConvertFrom-Json
        Write-Host "✅ Get Me Success!" -ForegroundColor Green
        Write-Host "   User: $($result.email)" -ForegroundColor Gray
        Write-Host "   Role: $($result.role)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Get Me Failed: $_" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Response: $responseBody" -ForegroundColor Red
        }
    }
}

Write-Host "`n✨ Tests completed!" -ForegroundColor Cyan

