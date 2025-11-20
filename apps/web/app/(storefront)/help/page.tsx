/**
 * Help/Support page
 */
export default function HelpPage() {
  const faqs = [
    {
      question: 'Siparişimi nasıl takip edebilirim?',
      answer:
        'Siparişinizi takip etmek için "Hesabım" bölümünden "Siparişlerim" sayfasına gidin. Sipariş numaranızı kullanarak da takip edebilirsiniz.',
    },
    {
      question: 'Kargo ücreti ne kadar?',
      answer:
        '150 TL ve üzeri siparişlerde kargo ücretsizdir. 150 TL altındaki siparişlerde kargo ücreti 25 TL\'dir.',
    },
    {
      question: 'Siparişimi nasıl iade edebilirim?',
      answer:
        'Ürünü aldıktan sonra 14 gün içinde iade edebilirsiniz. İade işlemi için "Hesabım" bölümünden "Siparişlerim" sayfasına gidin ve iade etmek istediğiniz ürünü seçin.',
    },
    {
      question: 'Ödeme yöntemleri nelerdir?',
      answer:
        'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini kullanabilirsiniz. Tüm ödemeler SSL sertifikası ile korunmaktadır.',
    },
    {
      question: 'Ürün stokta yoksa ne olur?',
      answer:
        'Stokta olmayan ürünler için bildirim alabilirsiniz. Ürün tekrar stokta olduğunda size e-posta ile bilgi verilecektir.',
    },
    {
      question: 'Kampanya kodlarını nasıl kullanabilirim?',
      answer:
        'Sepet sayfasında "Kampanya Kodu" bölümüne kodunuzu girerek indirim kazanabilirsiniz.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Yardım Merkezi</h1>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <a
            href="/shipping"
            className="card p-6 text-center hover:shadow-lg transition-shadow"
          >
            <svg
              className="w-12 h-12 text-primary-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <h3 className="font-semibold mb-2">Kargo Bilgileri</h3>
            <p className="text-sm text-gray-600">
              Kargo süreleri ve ücretleri hakkında bilgi alın
            </p>
          </a>

          <a
            href="/returns"
            className="card p-6 text-center hover:shadow-lg transition-shadow"
          >
            <svg
              className="w-12 h-12 text-primary-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <h3 className="font-semibold mb-2">İade & Değişim</h3>
            <p className="text-sm text-gray-600">
              İade ve değişim süreci hakkında bilgi
            </p>
          </a>

          <a
            href="/contact"
            className="card p-6 text-center hover:shadow-lg transition-shadow"
          >
            <svg
              className="w-12 h-12 text-primary-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="font-semibold mb-2">İletişim</h3>
            <p className="text-sm text-gray-600">
              Bize ulaşın, sorularınızı yanıtlayalım
            </p>
          </a>
        </div>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Sık Sorulan Sorular</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <summary className="font-semibold text-lg cursor-pointer list-none">
                  <div className="flex items-center justify-between">
                    <span>{faq.question}</span>
                    <svg
                      className="w-5 h-5 text-gray-400 transform transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>
                <p className="mt-4 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Still Need Help */}
        <section className="mt-12 p-8 bg-primary-50 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Hala yardıma mı ihtiyacınız var?
          </h2>
          <p className="text-gray-700 mb-6">
            Sorularınız için bizimle iletişime geçmekten çekinmeyin.
          </p>
          <a href="/contact" className="btn btn-primary">
            İletişime Geç
          </a>
        </section>
      </div>
    </div>
  );
}

