'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '../../components/ProductCard';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

/**
 * Product detail page
 */
export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          
          // Fetch related products
          if (data.categoryId) {
            fetchRelatedProducts(data.categoryId, data.id);
          }
        }
      } catch (error) {
        console.error('[ProductDetailPage] Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.slug]);

  const fetchRelatedProducts = async (categoryId: string, excludeId: string) => {
    try {
      const response = await fetch(
        `/api/products/list?categoryId=${categoryId}&limit=4`
      );
      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : data.products || [];
        setRelatedProducts(
          products.filter((p: any) => p.id !== excludeId).slice(0, 4)
        );
      }
    } catch (error) {
      console.error('[ProductDetailPage] Failed to fetch related products:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant,
          quantity,
        }),
      });

      if (response.ok) {
        // Show success message or redirect to cart
        alert('Ürün sepete eklendi!');
      } else {
        alert('Sepete eklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('[ProductDetailPage] Failed to add to cart:', error);
      alert('Sepete eklenirken bir hata oluştu.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Ürün Bulunamadı</h1>
        <p className="text-gray-600 mb-6">
          Aradığınız ürün bulunamadı veya kaldırılmış olabilir.
        </p>
        <Link href="/products" className="btn btn-primary">
          Ürünlere Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-primary-600">
          Ana Sayfa
        </Link>
        {' / '}
        <Link href="/products" className="hover:text-primary-600">
          Ürünler
        </Link>
        {' / '}
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="relative h-96 md:h-[500px] bg-gray-200 rounded-lg overflow-hidden mb-4">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  className="w-32 h-32"
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
          </div>
          {/* Thumbnail Gallery */}
          {(product.images && product.images.length > 1) && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-primary-600'
                      : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="mb-6">
            <span className="text-4xl font-bold text-primary-600">
              {product.price.toLocaleString('tr-TR')} {product.currency || '₺'}
            </span>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                {product.variants[0].type || 'Varyant'}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                      selectedVariant === variant.id
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {variant.name}
                    {variant.price && (
                      <span className="ml-2 text-sm">
                        (+{variant.price.toLocaleString('tr-TR')} ₺)
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            {product.inStock !== false ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Stokta Var
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Stokta Yok
              </span>
            )}
          </div>

          {product.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Açıklama</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Adet</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.inStock === false}
              className="btn btn-primary w-full text-lg py-3 disabled:opacity-50"
            >
              {addingToCart
                ? 'Ekleniyor...'
                : product.inStock === false
                ? 'Stokta Yok'
                : 'Sepete Ekle'}
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button className="btn btn-outline text-lg py-3">
                Favorilere Ekle
              </button>
              <button className="btn btn-outline text-lg py-3">
                Paylaş
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-semibold mb-4">Ürün Detayları</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Ürün Kodu:</dt>
                <dd className="font-medium">{product.id}</dd>
              </div>
              {product.category && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Kategori:</dt>
                  <dd className="font-medium">{product.category}</dd>
                </div>
              )}
              {product.brand && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Marka:</dt>
                  <dd className="font-medium">{product.brand}</dd>
                </div>
              )}
              {product.sku && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">SKU:</dt>
                  <dd className="font-medium">{product.sku}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <div className="border-b">
          <nav className="flex space-x-8">
            <button className="py-4 px-1 border-b-2 border-primary-600 font-medium text-primary-600">
              Detaylı Açıklama
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700">
              Özellikler
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700">
              Yorumlar
            </button>
          </nav>
        </div>
        <div className="py-8">
          <div className="prose max-w-none">
            {product.description && (
              <p className="text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            )}
            {product.specifications && (
              <div className="mt-6">
                <h4 className="font-semibold mb-4">Teknik Özellikler</h4>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-2">
                      <dt className="text-gray-600">{key}:</dt>
                      <dd className="font-medium">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Benzer Ürünler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct: any) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                name={relatedProduct.name}
                slug={relatedProduct.slug}
                price={relatedProduct.price}
                currency={relatedProduct.currency || '₺'}
                description={relatedProduct.description}
                image={relatedProduct.image}
                inStock={relatedProduct.inStock !== false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


