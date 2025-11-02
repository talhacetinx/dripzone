/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript hata kontrolünü devre dışı bırak
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint hata kontrolünü devre dışı bırak
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    unoptimized: true,
    domains: ['*'],
  },

  // Google Translate ve diğer kaynaklar için güvenlik başlıkları
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self' https://*.vercel.app https://*.googleapis.com;
              script-src 'self' 'unsafe-inline' 'unsafe-eval'
                https://translate.google.com
                https://translate.googleapis.com
                https://translate-pa.googleapis.com
                https://*.vercel.app;
              style-src 'self' 'unsafe-inline'
                https://translate.googleapis.com
                https://*.vercel.app;
              font-src 'self'
                https://fonts.gstatic.com
                https://translate.googleapis.com;
              connect-src 'self'
                https://translate.googleapis.com
                https://translate-pa.googleapis.com
                https://*.vercel.app
                ws://localhost:*
                wss://*.vercel.app
                wss://dripzone-topaz.vercel.app
                ${process.env.PROD_URL ? `wss://${process.env.PROD_URL.replace('https://', '')}` : ''};
              frame-src 'self'
                https://translate.googleapis.com
                https://*.vercel.app;
              img-src 'self' data: blob: https:
                https://translate.googleapis.com
                https://www.gstatic.com
                https://*.vercel.app
                https://dripzonemusic.com;
            `.replace(/\s+/g, ' ').trim(),
          },
        ],
      },
    ];
  },

  // ✅ Görsel optimizasyonunu kapattık
  images: {
    unoptimized: true, // 🔥 bu sayede _next/image hatası ortadan kalkar
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'translate.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'dripzone-topaz.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'dripzonemusic.com',
      },
    ],
  },

  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,

  // WebSocket ve server konfigürasyonu
  serverExternalPackages: ['socket.io', 'socket.io-client'],

  // Development proxy ayarı
  ...(process.env.NODE_ENV === 'development' && {
    async rewrites() {
      return [
        {
          source: '/socket.io/:path*',
          destination: '/api/socket/:path*',
        },
      ];
    },
  }),
};

export default nextConfig;