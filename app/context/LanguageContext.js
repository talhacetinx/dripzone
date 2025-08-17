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

  // Sayfa yüklendiğinde mevcut dil durumunu tespit et
  useEffect(() => {
    const detectCurrentLanguage = () => {
      if (typeof window !== 'undefined') {
        // Google Translate cookie'sini kontrol et
        const cookies = document.cookie;
        const googTransMatch = cookies.match(/googtrans=([^;]*)/);
        
        // Body class'ını kontrol et
        const bodyTranslated = document.body.className.includes('translated-ltr');
        
        console.log("🔍 Detecting language on page load:", {
          cookie: googTransMatch?.[1],
          bodyTranslated,
          currentState: currentLanguage
        });
        
        let detectedLang = 'tr'; // Default
        
        // Cookie'den dil tespit et
        if (googTransMatch) {
          const cookieValue = googTransMatch[1];
          if (cookieValue.includes('/en') || cookieValue === '/tr/en') {
            detectedLang = 'en';
            console.log("🌐 English detected from cookie");
          }
        }
        
        // Body class'ından tespit et (daha güvenilir)
        if (bodyTranslated) {
          detectedLang = 'en';
          console.log("🌐 English detected from body class");
        }
        
        // State'i güncelle
        if (detectedLang !== currentLanguage) {
          console.log(`🔄 Language updated: ${currentLanguage} → ${detectedLang}`);
          setCurrentLanguage(detectedLang);
          setForceUpdate(prev => prev + 1);
        }
      }
    };
    
    // İlk yükleme
    detectCurrentLanguage();
    
    // Periyodik kontrol (Google Translate async yüklenirse)
    const interval = setInterval(detectCurrentLanguage, 1000);
    
    // 10 saniye sonra interval'ı durdur
    setTimeout(() => {
      clearInterval(interval);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

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
            // Script yüklendikten sonra elementleri gizle
            setTimeout(hideGoogleTranslateElements, 1000);
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
                
                // Element oluşturulduktan sonra gizle
                setTimeout(hideGoogleTranslateElements, 500);
                
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

    // Google Translate elementlerini gizleyen fonksiyon
    const hideGoogleTranslateElements = () => {
      console.log("🙈 Hiding Google Translate UI elements...");
      
      const selectors = [
        '.goog-te-banner-frame',
        '.goog-te-menu-frame', 
        '.goog-te-ftab',
        '.goog-te-balloon-frame',
        '.goog-te-spinner-pos',
        'div[id^="goog-gt-"]',
        '.VIpgJd-ZVi9od-aZ2wEe-wOHMyf',
        '.VIpgJd-ZVi9od-xl07Ob-lTBxed',
        '.VIpgJd-ZVi9od-ORHb-OEVmcd',
        'iframe[src*="translate.google"]'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
        });
      });
      
      // Body'den Google Translate stil override'larını temizle
      document.body.style.position = 'static';
      document.body.style.top = 'auto';
      document.body.style.marginTop = '0';
      document.body.style.paddingTop = '0';
    };

    const setupTranslateObserver = () => {
      console.log("🔍 Setting up Google Translate observer...");
      
      // MutationObserver ile yeni eklenen Google Translate elementlerini gizle
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              // Google Translate elementlerini kontrol et
              if (node.classList && (
                node.classList.contains('goog-te-banner-frame') ||
                node.classList.contains('goog-te-menu-frame') ||
                node.classList.contains('goog-te-ftab') ||
                node.classList.contains('goog-te-balloon-frame')
              )) {
                console.log("🙈 Hiding newly added Google Translate element:", node.className);
                node.style.display = 'none';
                node.style.visibility = 'hidden';
              }
              
              // Içerisinde Google Translate elementleri olan konteynerları kontrol et
              const gtElements = node.querySelectorAll && node.querySelectorAll('[class*="goog-te"], [id*="goog-gt"]');
              if (gtElements) {
                gtElements.forEach(el => {
                  el.style.display = 'none';
                  el.style.visibility = 'hidden';
                });
              }
            }
          });
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Periyodik temizleme
      const cleanupInterval = setInterval(hideGoogleTranslateElements, 2000);
      
      // 30 saniye sonra temizleme interval'ını durdur
      setTimeout(() => {
        clearInterval(cleanupInterval);
        observer.disconnect();
      }, 30000);
    };

    addGoogleTranslateScript();
    
    // Sayfa yüklendiğinde de gizleme işlemi yap
    setTimeout(hideGoogleTranslateElements, 2000);
    
  }, []);

  // Dil değiştirme fonksiyonu - TR dönüş destekli
  const changeLanguage = (langCode) => {
    console.log("🔧 LanguageContext changeLanguage called:", { langCode, currentLanguage });
    
    if (langCode === currentLanguage) {
      console.log("⚠️ Same language, skipping");
      return;
    }
    
    setIsTranslating(true);
    setCurrentLanguage(langCode);
    console.log("✅ Language state updated to:", langCode);

    try {
      const domain = window.location.hostname;
      
      if (langCode === 'tr') {
        // TR'ye dönmek için özel işlem
        console.log("🔄 Switching back to Turkish...");
        
        // Google Translate cookie'sini temizle/sıfırla
        document.cookie = `googtrans=/tr/tr; path=/; domain=${domain}; max-age=31536000`;
        document.cookie = `googtrans=; path=/; domain=${domain}; max-age=0`; // Cookie sil
        
        // Body class'ını temizle
        document.body.classList.remove('translated-ltr', 'translated-rtl');
        document.documentElement.lang = 'tr';
        
        console.log("🍪 Turkish cookies set and classes cleared");
        
        // Sayfayı yeniden yükle
        setTimeout(() => {
          console.log("🔄 Reloading page for Turkish...");
          window.location.reload();
        }, 300);
        
      } else {
        // İngilizce'ye geçmek için
        console.log("🔄 Switching to English...");
        
        const cookieValue = '/tr/en';
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}; max-age=31536000`;
        console.log(`🍪 Cookie set: googtrans=${cookieValue}`);
        
        // Sayfayı yeniden yükle
        setTimeout(() => {
          console.log("🔄 Reloading page for translation...");
          window.location.reload();
        }, 300);
      }
      
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
