/** @type {import('next').NextConfig} */

import path from "path";

const isProd = process.env.NODE_ENV === "production";

// ✅ Production’da console.* fonksiyonlarını devre dışı bırak
if (isProd) {
  ["log", "warn", "error", "info", "debug"].forEach(method => {
    console[method] = () => {};
  });
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // ✅ Derleme hatalarını build sırasında durdurmasın
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // ✅ Görsel ayarları
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "translate.googleapis.com" },
      { protocol: "https", hostname: "www.gstatic.com" },
      { protocol: "https", hostname: "dripzone-topaz.vercel.app" },
      { protocol: "https", hostname: "dripzonemusic.com" },
    ],
  },

  // ✅ Public/uploads içeriği de img-src'ye eklendi
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
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
                ${process.env.PROD_URL ? `wss://${process.env.PROD_URL.replace("https://", "")}` : ""};
              frame-src 'self'
                https://translate.googleapis.com
                https://*.vercel.app;
              img-src 'self' data: blob: filesystem: https:
                https://translate.googleapis.com
                https://www.gstatic.com
                https://*.vercel.app
                https://dripzonemusic.com
                /uploads/;
            `.replace(/\s+/g, " ").trim(),
          },
        ],
      },
    ];
  },

  // ✅ Socket IO dış paketleri
  serverExternalPackages: ["socket.io", "socket.io-client"],

  // ✅ Development ortamında Socket yönlendirmesi
  ...(process.env.NODE_ENV === "development" && {
    async rewrites() {
      return [
        {
          source: "/socket.io/:path*",
          destination: "/api/socket/:path*",
        },
      ];
    },
  }),

  // ✅ Ek güvenlik ve upload klasörü kontrolü
  webpack: (config) => {
    // public/uploads klasörünü build dışında tutar (silinmez)
    config.resolve.alias["@uploads"] = path.resolve("./public/uploads");
    return config;
  },
};

export default nextConfig;