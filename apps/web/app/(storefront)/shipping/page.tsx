/**
 * Shipping information page
 */
export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Kargo Bilgileri</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Free Shipping */}
          <section className="card p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-600">
              Ücretsiz Kargo
            </h2>
            <p className="text-gray-700 mb-4">
              150 TL ve üzeri tüm siparişlerde kargo ücretsizdir. Ücretsiz
              kargo kampanyalarımızdan haberdar olmak için bültenimize
              abone olabilirsiniz.
            </p>
          </section>

          {/* Shipping Fees */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Kargo Ücretleri</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      Sipariş Tutarı
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      Kargo Ücreti
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">
                      0 - 149 TL
                    </td>
                    <td className="border border-gray-300 px-4 py-3">25 TL</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      150 TL ve üzeri
                    </td>
                    <td className="border border-gray-300 px-4 py-3 font-semibold text-primary-600">
                      ÜCRETSİZ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Delivery Times */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Teslimat Süreleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-3">İstanbul</h3>
                <p className="text-gray-700">
                  Siparişleriniz 1-2 iş günü içinde teslim edilir.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Marmara Bölgesi
                </h3>
                <p className="text-gray-700">
                  Siparişleriniz 2-3 iş günü içinde teslim edilir.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Diğer Şehirler
                </h3>
                <p className="text-gray-700">
                  Siparişleriniz 3-5 iş günü içinde teslim edilir.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Anadolu Bölgesi
                </h3>
                <p className="text-gray-700">
                  Siparişleriniz 5-7 iş günü içinde teslim edilir.
                </p>
              </div>
            </div>
          </section>

          {/* Tracking */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Sipariş Takibi</h2>
            <p className="text-gray-700 mb-4">
              Siparişinizin durumunu takip etmek için:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>
                "Hesabım" bölümünden "Siparişlerim" sayfasına gidin
              </li>
              <li>
                Takip etmek istediğiniz siparişi seçin
              </li>
              <li>
                Sipariş durumunu ve kargo bilgilerini görüntüleyin
              </li>
            </ol>
            <p className="text-gray-700 mt-4">
              Siparişiniz kargoya verildiğinde size SMS ve e-posta ile kargo
              takip numarası gönderilecektir.
            </p>
          </section>

          {/* Important Notes */}
          <section className="card p-6 bg-yellow-50 border-yellow-200">
            <h2 className="text-2xl font-semibold mb-4">Önemli Notlar</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span>
                  Teslimat süreleri iş günleri bazında hesaplanmaktadır (Pazar
                  günleri hariç).
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span>
                  Hava koşulları, doğal afetler gibi olağanüstü durumlarda
                  teslimat süreleri uzayabilir.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span>
                  Teslimat sırasında adresinizde bulunmamanız durumunda kargo
                  firması ile iletişime geçmeniz gerekmektedir.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span>
                  Yanlış adres bilgisi nedeniyle oluşan gecikmelerden
                  sorumluluk kabul edilmez.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

