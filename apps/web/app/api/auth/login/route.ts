import { NextRequest, NextResponse } from 'next/server';

/**
 * BFF Route: User login
 * Proxies request to Auth Service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    const response = await fetch(`${authServiceUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[BFF] Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

