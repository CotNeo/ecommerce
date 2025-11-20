import { NextRequest, NextResponse } from 'next/server';

/**
 * BFF Route: Get product by slug
 * Proxies request to Catalog Service
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const catalogServiceUrl = process.env.CATALOG_SERVICE_URL || 'http://localhost:3002';

    const response = await fetch(`${catalogServiceUrl}/api/v1/products/${params.slug}`, {
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
    console.error('[BFF] Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

