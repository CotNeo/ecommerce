'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * Checkout page
 */
export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
    },
    billingAddress: {
      sameAsShipping: true,
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
    },
    paymentMethod: 'card',
  });

  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          setCart(data);
        } else {
          router.push('/cart');
        }
      } catch (error) {
        console.error('[CheckoutPage] Failed to fetch cart:', error);
        router.push('/cart');
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          cartId: cart?.id,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddress.sameAsShipping
            ? formData.shippingAddress
            : formData.billingAddress,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to payment or order confirmation
        router.push(`/account/orders/${data.order.id}`);
      } else {
        alert('Sipariş oluşturulurken bir hata oluştu.');
      }
    } catch (error) {
      console.error('[CheckoutPage] Checkout error:', error);
      alert('Sipariş oluşturulurken bir hata oluştu.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Sepetiniz Boş</h1>
        <p className="text-gray-600 mb-6">
          Ödeme yapmak için sepetinizde ürün bulunmalıdır.
        </p>
        <Link href="/products" className="btn btn-primary">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Ödeme</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-6">Teslimat Adresi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ad</label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          firstName: e.target.value,
                        },
                      })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Soyad</label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.lastName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          lastName: e.target.value,
                        },
                      })
                    }
                    className="input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Adres</label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          address: e.target.value,
                        },
                      })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Şehir</label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          city: e.target.value,
                        },
                      })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Posta Kodu
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.postalCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          postalCode: e.target.value,
                        },
                      })
                    }
                    className="input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Telefon</label>
                  <input
                    type="tel"
                    required
                    value={formData.shippingAddress.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          phone: e.target.value,
                        },
                      })
                    }
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-6">Fatura Adresi</h2>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.billingAddress.sameAsShipping}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billingAddress: {
                          ...formData.billingAddress,
                          sameAsShipping: e.target.checked,
                        },
                      })
                    }
                    className="mr-2"
                  />
                  <span>Teslimat adresi ile aynı</span>
                </label>
              </div>

              {!formData.billingAddress.sameAsShipping && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ad</label>
                    <input type="text" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Soyad</label>
                    <input type="text" className="input" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Adres</label>
                    <input type="text" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Şehir</label>
                    <input type="text" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Posta Kodu
                    </label>
                    <input type="text" className="input" />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-6">Ödeme Yöntemi</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-primary-600 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Kredi/Banka Kartı</div>
                    <div className="text-sm text-gray-600">
                      Visa, Mastercard, Troy
                    </div>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Kapıda Ödeme</div>
                    <div className="text-sm text-gray-600">
                      Teslimat sırasında nakit ödeme
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>
                    {cart.totalAmount.toLocaleString('tr-TR')} {cart.currency || '₺'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo</span>
                  <span className="text-green-600">Ücretsiz</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Toplam</span>
                  <span className="text-primary-600">
                    {cart.totalAmount.toLocaleString('tr-TR')} {cart.currency || '₺'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="btn btn-primary w-full disabled:opacity-50"
              >
                {processing ? 'İşleniyor...' : 'Siparişi Tamamla'}
              </button>

              <Link
                href="/cart"
                className="btn btn-outline w-full text-center block mt-3"
              >
                Sepete Dön
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


