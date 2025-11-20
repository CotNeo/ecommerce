import { NextRequest, NextResponse } from 'next/server';

/**
 * BFF Route: Get categories
 */
export async function GET(request: NextRequest) {
  try {
    const catalogServiceUrl = process.env.CATALOG_SERVICE_URL || 'http://localhost:3002';

    const response = await fetch(`${catalogServiceUrl}/api/v1/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[BFF] Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

