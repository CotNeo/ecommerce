/**
 * Shared DTOs for API communication
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  createdAt: string;
}

export interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CreateOrderRequest {
  cartId?: string;
  shippingAddressId: string;
  billingAddressId?: string;
}

export interface CreatePaymentIntentRequest {
  orderId: string;
  amount: number;
  currency?: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret?: string;
  payUrl?: string;
  paymentIntentId: string;
}

