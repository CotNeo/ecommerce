'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Account settings page
 */
export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

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
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
          });
        } else {
          window.location.href = '/auth/login';
        }
      } catch (error) {
        console.error('[SettingsPage] Failed to fetch user:', error);
        window.location.href = '/auth/login';
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Implement update user API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Bilgileriniz güncellendi!');
    } catch (error) {
      console.error('[SettingsPage] Failed to update user:', error);
      alert('Güncelleme sırasında bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="card p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
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
        <h1 className="text-4xl font-bold mt-4">Hesap Ayarları</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card p-6">
            <nav className="space-y-2">
              <Link
                href="/account"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
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
                className="block px-4 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium"
              >
                Hesap Ayarları
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-6">Kişisel Bilgiler</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-2"
                  >
                    Ad
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-2"
                  >
                    Soyad
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  E-posta
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="input bg-gray-50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  E-posta adresiniz değiştirilemez.
                </p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Telefon
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="input"
                  placeholder="+90 (5XX) XXX XX XX"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </form>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-6">Adreslerim</h2>
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">Henüz kayıtlı adresiniz bulunmamaktadır.</p>
              <button className="btn btn-outline">Yeni Adres Ekle</button>
            </div>
          </div>

          <div className="card p-6 mt-6 border-red-200 bg-red-50">
            <h2 className="text-2xl font-semibold mb-4 text-red-800">
              Tehlikeli Bölge
            </h2>
            <p className="text-gray-700 mb-4">
              Hesabınızı silmek istiyorsanız, aşağıdaki butona tıklayın. Bu
              işlem geri alınamaz.
            </p>
            <button className="btn bg-red-600 text-white hover:bg-red-700">
              Hesabı Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


