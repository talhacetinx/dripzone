import React from 'react';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import Link from 'next/link';


export const Footer = () => {
  const quickLinks = [
    { name: 'Hakkımızda', path: '/about' },
    { name: 'Çerez Politikası', path: '/cookie' },
  ];

  const categories = [
    { name: 'Kayıt Stüdyoları', slug: 'recording-studios' },
    { name: 'Yapımcılar', slug: 'producers' },
    { name: 'Albüm Kapağı Sanatçıları', slug: 'album-cover-artists' },
    { name: 'Video Yönetmenleri', slug: 'videographers' },
  ];

  return (
    <footer className="bg-black/80 backdrop-blur-xl border-t border-primary-500/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/TpazLayer 2-topaz-enhance-min.png" 
                alt="Dripzone Logo" 
                className="h-8 w-auto object-contain filter drop-shadow-lg"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Müzik endüstrisi profesyonellerini ve sanatçıları birleştiren dünyanın en büyük pazaryeri platformu.
            </p>
            <div className="flex items-center justify-start">
              <a
                href="https://www.instagram.com/dripzonemusic/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-400">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                >
                  Şartlar ve Koşullar
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-400">Kategoriler</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-400">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">info@dripzonemusic.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">Dünya Çapında</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Footer Links */}
        <div className="border-t border-primary-500/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Dripzone. Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};