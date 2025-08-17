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
  const [forceUpdate, setForceUpdate] = useState(0);

  // Debug için state değişikliklerini logla
  useEffect(() => {
    console.log("🔄 Language state changed:", currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      console.log("📜 Loading Google Translate script...");
      
      if (typeof window !== 'undefined') {
        const existingScript = document.querySelector('script[src*="translate.google.com"]');
        
        if (!existingScript && !window.google?.translate) {
          const script = document.createElement('script');
          script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            console.log("📜 Google Translate script loaded successfully");
          };
          
          script.onerror = () => {
            console.log("❌ Failed to load Google Translate script");
          };
          
          document.head.appendChild(script);
          console.log("✅ Google Translate script added to head");

          window.googleTranslateElementInit = () => {
            console.log("🔧 Google Translate initializing...");
            
            try {
              if (window.google?.translate) {
                new window.google.translate.TranslateElement({
                  pageLanguage: 'tr',
                  includedLanguages: 'tr,en',
                  layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                }, 'google_translate_element');
                console.log("✅ Google Translate element created successfully");
                
                setTimeout(() => {
                  const combo = document.querySelector('.goog-te-combo');
                  console.log("🔍 Google Translate combo element:", combo);
                  if (combo) {
                    setupTranslateObserver();
                  }
                }, 1000);
              } else {
                console.log("❌ Google Translate API not available");
              }
            } catch (error) {
              console.error("❌ Error initializing Google Translate:", error);
            }
          };
        }
      }
    };

    const setupTranslateObserver = () => {
      console.log("🔍 Setting up Google Translate observer...");
    };

    addGoogleTranslateScript();
  }, []);

  // Dil değiştirme fonksiyonu - Basit ve çalışan versiyon
  const changeLanguage = (langCode) => {
    console.log("🔧 LanguageContext changeLanguage called:", { langCode, currentLanguage });
    
    if (langCode === currentLanguage) {
      console.log("⚠️ Same language, skipping");
      return;
    }
    
    setIsTranslating(true);
    setCurrentLanguage(langCode);
    console.log("✅ Language state updated to:", langCode);

    // Cookie-based çeviri (en güvenilir yöntem)
    try {
      const domain = window.location.hostname;
      const cookieValue = langCode === 'en' ? '/tr/en' : '/tr/tr';
      
      // Cookie ayarla
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}; max-age=31536000`;
      console.log(`🍪 Cookie set: googtrans=${cookieValue}`);
      
      // Sayfayı yeniden yükle
      setTimeout(() => {
        console.log("🔄 Reloading page for translation...");
        window.location.reload();
      }, 500);
      
    } catch (error) {
      console.error("❌ Translation failed:", error);
      setIsTranslating(false);
    }
  };

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const value = {
    currentLanguage,
    setCurrentLanguage,
    changeLanguage,
    languages,
    isTranslating,
    forceUpdate
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
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
