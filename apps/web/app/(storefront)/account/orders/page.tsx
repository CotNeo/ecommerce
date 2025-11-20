'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Orders page
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          window.location.href = '/auth/login';
          return;
        }

        const response = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(Array.isArray(data) ? data : data.orders || []);
        }
      } catch (error) {
        console.error('[OrdersPage] Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      DRAFT: 'Taslak',
      PENDING_PAYMENT: 'Ödeme Bekleniyor',
      PAID: 'Ödendi',
      SHIPPED: 'Kargoda',
      COMPLETED: 'Tamamlandı',
      CANCELLED: 'İptal Edildi',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <Link
          href="/account"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Hesabıma Dön
        </Link>
        <h1 className="text-4xl font-bold mt-4">Siparişlerim</h1>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Henüz Siparişiniz Yok</h3>
          <p className="text-gray-600 mb-6">
            İlk siparişinizi vermek için ürünlerimizi keşfedin.
          </p>
          <Link href="/products" className="btn btn-primary">
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Sipariş #{order.id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      {order.items?.length || 0} ürün
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {order.totalAmount.toLocaleString('tr-TR')}{' '}
                      {order.currency || '₺'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="btn btn-outline text-sm"
                  >
                    Detayları Gör
                  </Link>
                  {order.status === 'PAID' && (
                    <button className="btn btn-secondary text-sm">
                      İade Et
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


