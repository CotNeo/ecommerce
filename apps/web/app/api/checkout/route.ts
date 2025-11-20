import { NextRequest, NextResponse } from 'next/server';

/**
 * BFF Route: Create checkout (order draft + payment intent)
 * Orchestrates Order Service and Payment Service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3004';
    const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005';

    // 1. Create order draft
    const orderResponse = await fetch(`${orderServiceUrl}/api/v1/orders/draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify({
        userId: body.userId,
        cartId: body.cartId,
        shippingAddress: body.shippingAddress,
        billingAddress: body.billingAddress,
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      return NextResponse.json(errorData, { status: orderResponse.status });
    }

    const orderData = await orderResponse.json();

    // 2. Create payment intent
    const paymentResponse = await fetch(`${paymentServiceUrl}/api/v1/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify({
        orderId: orderData.id,
        amount: orderData.totalAmount,
      }),
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json();
      return NextResponse.json(errorData, { status: paymentResponse.status });
    }

    const paymentData = await paymentResponse.json();

    return NextResponse.json({
      order: orderData,
      payment: paymentData,
    });
  } catch (error) {
    console.error('[BFF] Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

