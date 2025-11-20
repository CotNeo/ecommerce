/**
 * About page
 */
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Hakkımızda</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Biz Kimiz?</h2>
            <p className="text-gray-700 mb-4">
              E-Commerce olarak, 2024 yılından beri müşterilerimize en kaliteli
              ürünleri en uygun fiyatlarla sunmayı hedefliyoruz. Modern
              teknoloji ve müşteri odaklı yaklaşımımızla, online alışveriş
              deneyimini bir üst seviyeye taşıyoruz.
            </p>
            <p className="text-gray-700">
              Misyonumuz, müşterilerimize güvenli, hızlı ve memnuniyet verici
              bir alışveriş deneyimi sunmak ve onların ihtiyaçlarını en iyi
              şekilde karşılamaktır.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Vizyonumuz</h2>
            <p className="text-gray-700 mb-4">
              Türkiye'nin en güvenilir ve yenilikçi e-ticaret platformu olmak.
              Müşterilerimizin her zaman ilk tercihi olmak ve sektörde öncü
              olmak için sürekli kendimizi geliştiriyoruz.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Değerlerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary-600">
                  Müşteri Memnuniyeti
                </h3>
                <p className="text-gray-700">
                  Müşterilerimizin memnuniyeti bizim için en önemli önceliktir.
                  Her adımda müşteri deneyimini iyileştirmeye odaklanıyoruz.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary-600">
                  Kalite
                </h3>
                <p className="text-gray-700">
                  Sunduğumuz tüm ürünler kalite kontrolünden geçmektedir. Sadece
                  en iyi ürünleri müşterilerimize sunuyoruz.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary-600">
                  Güvenilirlik
                </h3>
                <p className="text-gray-700">
                  Güvenli ödeme sistemleri ve şeffaf iş süreçleriyle
                  müşterilerimizin güvenini kazanıyoruz.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary-600">
                  Yenilikçilik
                </h3>
                <p className="text-gray-700">
                  Teknolojinin en son imkanlarını kullanarak, müşterilerimize
                  en iyi alışveriş deneyimini sunuyoruz.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Neden Bizi Seçmelisiniz?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0"
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
                <span>Geniş ürün yelpazesi ve çeşitli kategoriler</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0"
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
                <span>Hızlı ve güvenli kargo seçenekleri</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0"
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
                <span>7/24 müşteri desteği</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0"
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
                <span>Güvenli ödeme sistemleri</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0"
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
                <span>Kolay iade ve değişim süreci</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

