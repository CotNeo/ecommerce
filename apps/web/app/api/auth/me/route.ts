import { NextRequest, NextResponse } from 'next/server';

/**
 * BFF Route: Get current user
 * Proxies request to Auth Service with auth token
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    const response = await fetch(`${authServiceUrl}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[BFF] Get me error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

