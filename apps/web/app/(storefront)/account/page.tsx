'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Account dashboard page
 */
export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          window.location.href = '/auth/login';
          return;
        }

        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          window.location.href = '/auth/login';
        }
      } catch (error) {
        console.error('[AccountPage] Failed to fetch user:', error);
        window.location.href = '/auth/login';
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Hesabım</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card p-6">
            <div className="mb-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  {user.firstName?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-center">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email}
              </h2>
              <p className="text-gray-600 text-center text-sm">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <Link
                href="/account"
                className="block px-4 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium"
              >
                Hesap Özeti
              </Link>
              <Link
                href="/account/orders"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Siparişlerim
              </Link>
              <Link
                href="/account/settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Hesap Ayarları
              </Link>
              {user.role === 'ADMIN' && (
                <>
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                      Admin Paneli
                    </div>
                    <Link
                      href="/admin/products"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Ürün Yönetimi
                    </Link>
                    <Link
                      href="/admin/categories"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Kategori Yönetimi
                    </Link>
                    <Link
                      href="/admin/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Sipariş Yönetimi
                    </Link>
                  </div>
                </>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  window.dispatchEvent(new Event('auth-change'));
                  window.location.href = '/';
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Çıkış Yap
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {user.role === 'ADMIN' ? (
            <>
              {/* Admin Dashboard */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Admin Paneli</h2>
                <p className="text-gray-600 mb-6">
                  Ürün ve kategori yönetimi yapabilir, siparişleri görüntüleyebilirsiniz.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Link
                  href="/admin/products"
                  className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Ürün Yönetimi</h3>
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Ürün ekle, düzenle veya sil. Katalog yönetimi yap.
                  </p>
                  <div className="mt-4 text-primary-600 font-medium">
                    Yönet →
                  </div>
                </Link>

                <Link
                  href="/admin/categories"
                  className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Kategori Yönetimi</h3>
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Kategorileri düzenle, yeni kategori ekle veya sil.
                  </p>
                  <div className="mt-4 text-primary-600 font-medium">
                    Yönet →
                  </div>
                </Link>

                <Link
                  href="/admin/orders"
                  className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Sipariş Yönetimi</h3>
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Tüm siparişleri görüntüle ve yönet.
                  </p>
                  <div className="mt-4 text-primary-600 font-medium">
                    Yönet →
                  </div>
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="card p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Hızlı İşlemler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/admin/products"
                    className="btn btn-primary w-full"
                  >
                    + Yeni Ürün Ekle
                  </Link>
                  <Link
                    href="/admin/categories"
                    className="btn btn-outline w-full"
                  >
                    + Yeni Kategori Ekle
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* User Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
                  <div className="text-gray-600">Aktif Sipariş</div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
                  <div className="text-gray-600">Tamamlanan Sipariş</div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
                  <div className="text-gray-600">Favori Ürün</div>
                </div>
              </div>
            </>
          )}

          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {user.role === 'ADMIN' ? 'Son Siparişler' : 'Son Siparişlerim'}
            </h2>
            <div className="text-center py-8 text-gray-500">
              <p>
                {user.role === 'ADMIN'
                  ? 'Henüz sipariş bulunmamaktadır.'
                  : 'Henüz siparişiniz bulunmamaktadır.'}
              </p>
              <Link href="/products" className="btn btn-primary mt-4 inline-block">
                {user.role === 'ADMIN' ? 'Ürünleri Görüntüle' : 'Alışverişe Başla'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

