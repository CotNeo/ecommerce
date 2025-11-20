/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Docker için standalone output
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  env: {
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    CATALOG_SERVICE_URL: process.env.CATALOG_SERVICE_URL || 'http://localhost:3002',
    CART_SERVICE_URL: process.env.CART_SERVICE_URL || 'http://localhost:3003',
    ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
    PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
    NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;

