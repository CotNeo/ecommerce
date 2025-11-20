import Link from 'next/link';
import ProductCard from '../components/ProductCard';

/**
 * Home page with hero section and featured products
 */
export default async function HomePage() {
  // Fetch featured products
  let products = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/list?limit=8`, {
      cache: 'no-store',
    });
    if (response.ok) {
      products = await response.json();
    }
  } catch (error) {
    console.error('[HomePage] Failed to fetch products:', error);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Modern Alışveriş Deneyimi
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              En kaliteli ürünleri en uygun fiyatlarla keşfedin. Hızlı kargo ve
              güvenli ödeme ile kapınıza gelsin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Ürünleri Keşfet
              </Link>
              <Link href="/about" className="btn btn-outline border-white text-white hover:bg-white/10">
                Hakkımızda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Öne Çıkan Ürünler</h2>
            <Link
              href="/products"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Tümünü Gör →
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  currency={product.currency || '₺'}
                  description={product.description}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Henüz ürün bulunmamaktadır.</p>
              <p className="text-sm text-gray-400">
                Ürünler yüklendiğinde burada görünecektir.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Güvenli Ödeme</h3>
              <p className="text-gray-600">
                Tüm ödemeleriniz SSL sertifikası ile korunmaktadır.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hızlı Kargo</h3>
              <p className="text-gray-600">
                Siparişleriniz en kısa sürede kapınıza gelir.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Kalite Garantisi</h3>
              <p className="text-gray-600">
                Tüm ürünlerimiz kalite kontrolünden geçmektedir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

