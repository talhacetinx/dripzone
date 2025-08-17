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
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                https://translate.google.com 
                https://translate.googleapis.com 
                https://translate-pa.googleapis.com;
              style-src 'self' 'unsafe-inline' 
                https://translate.googleapis.com;
              font-src 'self' 
                https://fonts.gstatic.com 
                https://translate.googleapis.com;
              connect-src 'self' 
                https://translate.googleapis.com 
                https://translate-pa.googleapis.com;
              frame-src 
                https://translate.googleapis.com;
              img-src 'self' data: blob: 
                https://translate.googleapis.com 
                https://www.gstatic.com;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ];
  },
  
  // External domain'lere izin ver
  images: {
    domains: [
      'translate.googleapis.com',
      'www.gstatic.com'
    ],
  },
  
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // swcMinify removed - already default in Next.js 15
};

export default nextConfig;
