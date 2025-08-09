"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  const [isTranslating, setIsTranslating] = useState(false);

  // Google Translate script'ini yükle
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (typeof window !== 'undefined' && !window.google?.translate) {
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);

        window.googleTranslateElementInit = () => {
          if (window.google?.translate) {
            new window.google.translate.TranslateElement({
              pageLanguage: 'tr',
              includedLanguages: 'tr,en',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            }, 'google_translate_element');
          }
        };
      }
    };

    addGoogleTranslateScript();
  }, []);

  // Dil değiştirme fonksiyonu - URL değişimini önle
  const changeLanguage = (langCode) => {
    if (langCode === currentLanguage) return;
    
    setIsTranslating(true);
    setCurrentLanguage(langCode);

    // Google Translate'i programmatik olarak kullan
    const translateElement = document.querySelector('.goog-te-combo');
    if (translateElement) {
      translateElement.value = langCode;
      translateElement.dispatchEvent(new Event('change'));
    }

    // URL'deki hash'leri temizle
    const cleanUrl = () => {
      if (window.location.hash.includes('googtrans')) {
        const newUrl = window.location.pathname + window.location.search;
        window.history.replaceState(null, null, newUrl);
      }
    };

    // Hash temizleme işlemini farklı timing'lerde yap
    setTimeout(cleanUrl, 100);
    setTimeout(cleanUrl, 500);
    setTimeout(cleanUrl, 1000);
    setTimeout(() => setIsTranslating(false), 1500);
  };

  // URL hash'lerini sürekli temizle
  useEffect(() => {
    const cleanUrlHash = () => {
      if (typeof window !== 'undefined' && window.location.hash.includes('googtrans')) {
        const newUrl = window.location.pathname + window.location.search;
        window.history.replaceState(null, null, newUrl);
      }
    };

    const intervalId = setInterval(cleanUrlHash, 1000);
    window.addEventListener('hashchange', cleanUrlHash);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('hashchange', cleanUrlHash);
    };
  }, []);

  // Dil seçenekleri
  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const value = {
    currentLanguage,
    setCurrentLanguage,
    changeLanguage,
    languages,
    isTranslating
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
      {/* Google Translate Element - gizli */}
      <div 
        id="google_translate_element" 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          opacity: 0, 
          pointerEvents: 'none' 
        }}
      />
    </LanguageContext.Provider>
  );
};
