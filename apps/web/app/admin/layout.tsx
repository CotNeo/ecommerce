'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.role !== 'ADMIN') {
            router.push('/');
            return;
          }
          setUser(data);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('[AdminLayout] Failed to check admin:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <div className="flex items-center space-x-6">
              <Link
                href="/admin/products"
                className="hover:text-gray-300 transition-colors"
              >
                Ürün Yönetimi
              </Link>
              <Link
                href="/admin/categories"
                className="hover:text-gray-300 transition-colors"
              >
                Kategori Yönetimi
              </Link>
              <Link
                href="/admin/orders"
                className="hover:text-gray-300 transition-colors"
              >
                Sipariş Yönetimi
              </Link>
              <Link
                href="/"
                className="hover:text-gray-300 transition-colors"
              >
                Ana Sayfaya Dön
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

