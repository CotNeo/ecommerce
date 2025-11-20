/**
 * Returns and exchanges page
 */
export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">İade & Değişim</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Return Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">İade Koşulları</h2>
            <p className="text-gray-700 mb-4">
              Satın aldığınız ürünleri, teslim aldığınız tarihten itibaren{' '}
              <strong>14 gün içinde</strong> iade edebilirsiniz. İade edilecek
              ürünlerin:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Kullanılmamış ve orijinal ambalajında olması gerekir</li>
              <li>
                Faturası, garanti belgesi ve aksesuarları ile birlikte
                gönderilmesi gerekir
              </li>
              <li>
                Üzerinde herhangi bir hasar, kullanım izi veya değişiklik
                bulunmamalıdır
              </li>
            </ul>
          </section>

          {/* Return Process */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">İade Süreci</h2>
            <div className="space-y-4">
              <div className="card p-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">İade Talebi Oluşturun</h3>
                    <p className="text-gray-700">
                      "Hesabım" bölümünden "Siparişlerim" sayfasına gidin ve
                      iade etmek istediğiniz ürünü seçin. İade nedeninizi
                      belirtin.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Onay Bekleyin</h3>
                    <p className="text-gray-700">
                      İade talebiniz incelendikten sonra size e-posta ile
                      bilgi verilecektir. Onaylandıktan sonra kargo bilgileri
                      paylaşılacaktır.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Ürünü Gönderin</h3>
                    <p className="text-gray-700">
                      Ürünü orijinal ambalajında, faturası ve aksesuarları ile
                      birlikte belirtilen adrese gönderin. Kargo takip
                      numaranızı kaydedin.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">İade İşlemi Tamamlanır</h3>
                    <p className="text-gray-700">
                      Ürün kontrol edildikten sonra, ödeme yönteminize göre
                      iade işlemi 3-5 iş günü içinde tamamlanır.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Exchange Process */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Değişim Süreci</h2>
            <p className="text-gray-700 mb-4">
              Ürün değişimi için önce iade işlemini tamamlamanız, ardından
              yeni ürünü sipariş etmeniz gerekmektedir. Değişim işlemleri
              aynı iade koşullarına tabidir.
            </p>
          </section>

          {/* Return Fees */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">İade Ücretleri</h2>
            <div className="card p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-600 mr-3 mt-0.5 flex-shrink-0"
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
                  <span>
                    <strong>Ücretsiz İade:</strong> Ürün hatası veya yanlış
                    ürün gönderilmesi durumunda iade ücreti tarafımızdan
                    karşılanır.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>
                    <strong>Müşteri Kaynaklı İade:</strong> Ürün hatası
                    olmayan durumlarda kargo ücreti müşteriye aittir.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Non-Returnable Items */}
          <section className="card p-6 bg-red-50 border-red-200">
            <h2 className="text-2xl font-semibold mb-4 text-red-800">
              İade Edilemeyen Ürünler
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Kişisel hijyen ürünleri</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>İndirimli veya kampanyalı ürünler (belirtilmişse)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Kullanılmış veya hasarlı ürünler</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Orijinal ambalajı açılmış yazılım ve dijital ürünler</span>
              </li>
            </ul>
          </section>

          {/* Contact for Returns */}
          <section className="card p-8 bg-primary-50 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              İade ile ilgili sorularınız mı var?
            </h2>
            <p className="text-gray-700 mb-6">
              Müşteri hizmetlerimizle iletişime geçerek yardım alabilirsiniz.
            </p>
            <a href="/contact" className="btn btn-primary">
              İletişime Geç
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

