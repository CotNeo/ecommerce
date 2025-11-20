'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency?: string;
  image?: string;
  description?: string;
  inStock?: boolean;
}

/**
 * Product card component
 */
export default function ProductCard({
  id,
  name,
  slug,
  price,
  currency = '₺',
  image,
  description,
  inStock = true,
}: ProductCardProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) {
      alert('Bu ürün şu anda stokta bulunmamaktadır.');
      return;
    }

    setAdding(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        // Show success notification
        const notification = document.createElement('div');
        notification.className =
          'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = 'Ürün sepete eklendi!';
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
        }, 3000);
      } else {
        alert('Sepete eklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('[ProductCard] Failed to add to cart:', error);
      alert('Sepete eklenirken bir hata oluştu.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="card group relative">
      <Link href={`/products/${slug}`} className="block">
        <div className="relative h-64 bg-gray-200 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-24 h-24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {!inStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Stokta Yok
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              {price.toLocaleString('tr-TR')} {currency}
            </span>
          </div>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        disabled={adding || !inStock}
        className="btn btn-primary text-sm w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {adding ? 'Ekleniyor...' : inStock ? 'Sepete Ekle' : 'Stokta Yok'}
      </button>
    </div>
  );
}

