import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed database with notification templates
 */
async function main() {
  console.log('[NotificationService] Seeding database...');

  // Create email templates
  const templates = [
    {
      name: 'order_created',
      type: 'email',
      subject: 'Siparişiniz Alındı - #{{orderNumber}}',
      body: `
        <h1>Merhaba {{firstName}},</h1>
        <p>Siparişiniz başarıyla alındı.</p>
        <p><strong>Sipariş Numarası:</strong> {{orderNumber}}</p>
        <p><strong>Toplam Tutar:</strong> {{totalAmount}} {{currency}}</p>
        <p>Siparişinizin durumunu takip etmek için hesabınıza giriş yapabilirsiniz.</p>
        <p>Teşekkürler,<br>E-Commerce Ekibi</p>
      `,
      variables: {
        firstName: 'string',
        orderNumber: 'string',
        totalAmount: 'number',
        currency: 'string',
      },
    },
    {
      name: 'order_paid',
      type: 'email',
      subject: 'Ödemeniz Alındı - #{{orderNumber}}',
      body: `
        <h1>Merhaba {{firstName}},</h1>
        <p>Siparişinizin ödemesi başarıyla alındı.</p>
        <p><strong>Sipariş Numarası:</strong> {{orderNumber}}</p>
        <p>Siparişiniz en kısa sürede kargoya verilecektir.</p>
        <p>Teşekkürler,<br>E-Commerce Ekibi</p>
      `,
      variables: {
        firstName: 'string',
        orderNumber: 'string',
      },
    },
    {
      name: 'order_shipped',
      type: 'email',
      subject: 'Siparişiniz Kargoya Verildi - #{{orderNumber}}',
      body: `
        <h1>Merhaba {{firstName}},</h1>
        <p>Siparişiniz kargoya verildi.</p>
        <p><strong>Sipariş Numarası:</strong> {{orderNumber}}</p>
        <p><strong>Kargo Takip No:</strong> {{trackingNumber}}</p>
        <p>Teşekkürler,<br>E-Commerce Ekibi</p>
      `,
      variables: {
        firstName: 'string',
        orderNumber: 'string',
        trackingNumber: 'string',
      },
    },
    {
      name: 'password_reset',
      type: 'email',
      subject: 'Şifre Sıfırlama',
      body: `
        <h1>Merhaba {{firstName}},</h1>
        <p>Şifre sıfırlama talebiniz alındı.</p>
        <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
        <p><a href="{{resetLink}}">Şifremi Sıfırla</a></p>
        <p>Bu link 1 saat geçerlidir.</p>
        <p>Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        <p>Teşekkürler,<br>E-Commerce Ekibi</p>
      `,
      variables: {
        firstName: 'string',
        resetLink: 'string',
      },
    },
  ];

  for (const template of templates) {
    await prisma.notificationTemplate.upsert({
      where: { name: template.name },
      update: {},
      create: template,
    });
  }

  console.log('[NotificationService] Created notification templates');
  console.log('[NotificationService] Seeding completed!');
}

main()
  .catch((e) => {
    console.error('[NotificationService] Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

