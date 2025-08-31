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
  // Google Translate için external domain'lere izin ver
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
                wss://*.vercel.app;
              frame-src 'self'
                https://translate.googleapis.com
                https://*.vercel.app;
              img-src 'self' data: blob: https: 
                https://translate.googleapis.com 
                https://www.gstatic.com
                https://*.vercel.app;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ];
  },
  
  // External domain'lere izin ver
  images: {
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
      }
    ],
  },
  
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // swcMinify removed - already default in Next.js 15
};

export default nextConfig;
