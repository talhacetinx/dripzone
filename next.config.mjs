/** @type {import('next').NextConfig} */
const nextConfig = {
  // Google Translate için external domain'lere izin ver
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self' https://dripzone-topaz.vercel.app;
              script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                https://translate.google.com 
                https://translate.googleapis.com 
                https://translate-pa.googleapis.com
                https://dripzone-topaz.vercel.app;
              style-src 'self' 'unsafe-inline' 
                https://translate.googleapis.com
                https://dripzone-topaz.vercel.app;
              font-src 'self' 
                https://fonts.gstatic.com 
                https://translate.googleapis.com;
              connect-src 'self' 
                https://translate.googleapis.com 
                https://translate-pa.googleapis.com
                https://dripzone-topaz.vercel.app;
              frame-src 'self'
                https://translate.googleapis.com
                https://dripzone-topaz.vercel.app;
              img-src 'self' data: blob: 
                https://translate.googleapis.com 
                https://www.gstatic.com
                https://dripzone-topaz.vercel.app;
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
