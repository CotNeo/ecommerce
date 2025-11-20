import { NextRequest, NextResponse } from 'next/server';

/**
 * BFF Route: Get products list
 * Proxies request to Catalog Service
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const catalogServiceUrl = process.env.CATALOG_SERVICE_URL || 'http://localhost:3002';

    const queryString = searchParams.toString();
    const url = `${catalogServiceUrl}/api/v1/products${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
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
    console.error('[BFF] Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

