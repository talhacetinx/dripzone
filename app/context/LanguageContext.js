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
    // console.log("🔄 Language state changed:", currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      // console.log("📜 Loading Google Translate script...");
      
      if (typeof window !== 'undefined') {
        // Existing script check
        const existingScript = document.querySelector('script[src*="translate.google.com"]');
        
        if (!existingScript && !window.google?.translate) {
          const script = document.createElement('script');
          script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            // console.log("📜 Google Translate script loaded successfully");
          };
          
          script.onerror = () => {
            // console.log("❌ Failed to load Google Translate script");
          };
          
          document.head.appendChild(script);
          // console.log("✅ Google Translate script added to head");

          window.googleTranslateElementInit = () => {
            // console.log("🔧 Google Translate initializing...");
            
            try {
              if (window.google?.translate) {
                new window.google.translate.TranslateElement({
                  pageLanguage: 'tr',
                  includedLanguages: 'tr,en',
                  layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                }, 'google_translate_element');
                // console.log("✅ Google Translate element created successfully");
                
                // Element'in hazır olup olmadığını kontrol et ve observer kur
                setTimeout(() => {
                  const combo = document.querySelector('.goog-te-combo');
                  // console.log("🔍 Google Translate combo element:", combo);
                  if (combo) {
                    setupTranslateObserver();
                  }
                }, 1000);
              } else {
                // console.log("❌ Google Translate API not available");
              }
            } catch (error) {
              console.error("❌ Error initializing Google Translate:", error);
            }
          };
        } else {
          // console.log("ℹ️ Google Translate already loaded or script exists");
          
          // If already loaded, check for combo element and setup observer
          setTimeout(() => {
            const combo = document.querySelector('.goog-te-combo');
            // console.log("🔍 Existing Google Translate combo:", combo);
            if (combo) {
              setupTranslateObserver();
            }
          }, 1000);
        }
      }
    };

    // Google Translate değişikliklerini dinleyen observer
    const setupTranslateObserver = () => {
      console.log("🔍 Setting up Google Translate observer...");
      
      // MutationObserver ile Google Translate'in DOM değişikliklerini izle
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // Google Translate'in body'ye eklediği class'ları kontrol et
          if (mutation.target === document.body && mutation.type === 'attributes') {
            const bodyClasses = document.body.className;
            
            // Çeviri durumunu kontrol et
            if (bodyClasses.includes('translated-ltr')) {
              console.log("🌐 Page translated to English detected via observer");
              setCurrentLanguage('en');
            } else if (!bodyClasses.includes('translated-')) {
              console.log("🌐 Page back to Turkish detected via observer");
              setCurrentLanguage('tr');
            }
          }
        });
      });

      // Body'deki attribute değişikliklerini izle
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      });

      // Google Translate combo element'ini de izle
      const comboObserver = new MutationObserver(() => {
        const combo = document.querySelector('.goog-te-combo');
        if (combo && !combo.hasEventListener) {
          combo.hasEventListener = true; // Duplicate listener'ları önle
          combo.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            console.log("🔄 Google Translate combo changed to:", selectedLang);
            
            // Combo'dan gelen değeri header state'e yansıt
            setTimeout(() => {
              if (selectedLang === 'en') {
                console.log("� Setting language to English from combo");
                setCurrentLanguage('en');
              } else {
                console.log("📝 Setting language to Turkish from combo");
                setCurrentLanguage('tr');
              }
            }, 100);
          });
        }
      });

      // Combo element'in eklenmesini bekle
      comboObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Periyodik durum kontrolü - daha az agresif
      const statusCheckInterval = setInterval(() => {
        const bodyClasses = document.body.className;
        const combo = document.querySelector('.goog-te-combo');
        const cookies = document.cookie;
        const googTransMatch = cookies.match(/googtrans=([^;]*)/);
        
        let actualLang = 'tr';
        
        // En güvenilir kaynak sırasıyla: combo -> body class -> cookie
        if (combo && combo.value === 'en') {
          actualLang = 'en';
        } else if (combo && (combo.value === '' || combo.value === 'tr')) {
          actualLang = 'tr';
        } else if (bodyClasses.includes('translated-ltr')) {
          actualLang = 'en';
        } else if (googTransMatch && googTransMatch[1].includes('/en')) {
          actualLang = 'en';
        }
        
        // Sadece farklı olduğunda log ve güncelle
        if (actualLang !== currentLanguage) {
          // console.log("🔍 Status check difference detected:", { 
          //   bodyTranslated: bodyClasses.includes('translated-ltr'),
          //   comboValue: combo?.value || 'not found',
          //   cookieValue: googTransMatch?.[1] || 'not found',
          //   actualLang,
          //   currentState: currentLanguage
          // });
          
          setCurrentLanguage(actualLang);
          setForceUpdate(prev => prev + 1);
        }
      }, 2000); // Daha az sık kontrol et

      return () => {
        observer.disconnect();
        comboObserver.disconnect();
        clearInterval(statusCheckInterval);
      };
    };

    addGoogleTranslateScript();
    
    // Cleanup function
    return () => {
      // Observer'ları temizle
    };
  }, []);

  // Sayfa yüklendiğinde mevcut çeviri durumunu kontrol et
  useEffect(() => {
    const checkCurrentLanguage = () => {
      if (typeof window !== 'undefined') {
        // Google Translate cookie'sini kontrol et
        const cookies = document.cookie;
        const googTransMatch = cookies.match(/googtrans=([^;]*)/);
        
        let detectedLang = 'tr'; // Varsayılan dil
        
        if (googTransMatch) {
          const googTransValue = googTransMatch[1];
          // console.log("🍪 Found googtrans cookie:", googTransValue);
          
          // Cookie'deki dil kodunu doğru şekilde parse et
          if (googTransValue.includes('/en') || googTransValue === '/tr/en') {
            detectedLang = 'en';
            // console.log("🌐 Language detected: English (from cookie)");
          } else {
            detectedLang = 'tr';
            // console.log("🌐 Language detected: Turkish (from cookie)");
          }
        }
        
        // Body class'ını da kontrol et (cookie'yi override edebilir)
        const bodyClasses = document.body.className;
        if (bodyClasses.includes('translated-ltr')) {
          detectedLang = 'en';
          // console.log("🌐 Language detected: English (from body class - override)");
        } else if (bodyClasses.includes('translated-rtl')) {
          // RTL diller için (şu an kullanmıyoruz ama var olabilir)
          // console.log("🌐 Language detected: RTL language (from body class)");
        }
        
        // Combo element'i varsa kontrol et (en güvenilir)
        const combo = document.querySelector('.goog-te-combo');
        if (combo && combo.value) {
          if (combo.value === 'en') {
            detectedLang = 'en';
            // console.log("🌐 Language detected: English (from combo - final)");
          } else if (combo.value === '' || combo.value === 'tr') {
            detectedLang = 'tr';
            // console.log("🌐 Language detected: Turkish (from combo - final)");
          }
        }
        
        // console.log("🎯 Final detected language:", detectedLang);
        
        // Sadece farklı olduğunda güncelle
        setCurrentLanguage(prev => {
          if (prev !== detectedLang) {
            // console.log(`🔄 Language state change: ${prev} → ${detectedLang}`);
            return detectedLang;
          }
          return prev;
        });
      }
    };
    
    // İlk kontrol
    checkCurrentLanguage();
    
    // Daha uzun aralıklarla kontrol et (sürekli spam'i önlemek için)
    const intervalId = setInterval(checkCurrentLanguage, 5000);
    
    // Component unmount'ta temizle
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Dil değiştirme fonksiyonu - URL değişimini önle
  const changeLanguage = (langCode) => {
    // console.log("🔧 LanguageContext changeLanguage called:", { langCode, currentLanguage });
    
    if (langCode === currentLanguage) {
      // console.log("⚠️ Same language, skipping");
      return;
    }
    
    setIsTranslating(true);
    setCurrentLanguage(langCode);
    // console.log("✅ Language state updated to:", langCode);

    // Google Translate'i programmatik olarak kullan
    const translateElement = document.querySelector('.goog-te-combo');
    // console.log("🔍 Google Translate element:", translateElement);
    
    if (translateElement) {
      // Önce mevcut değeri kontrol et
      // console.log("📊 Current combo value before change:", translateElement.value);
      
      // Değeri ayarla
      if (langCode === 'tr') {
        translateElement.value = '';  // Türkçe için boş değer
      } else {
        translateElement.value = langCode;
      }
      
      // console.log("📊 Combo value after setting:", translateElement.value);
      
      // Change event'ini tetikle
      translateElement.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Eğer hala çalışmmazsa click event dene
      setTimeout(() => {
        if (langCode === 'tr' && document.body.className.includes('translated-')) {
          // console.log("🔄 Trying to reset to Turkish with click method");
          
          // Google Translate toolbar'ındaki original butonunu bul ve tıkla
          const originalButton = document.querySelector('.goog-te-banner-frame .goog-te-menu-value span');
          if (originalButton) {
            originalButton.click();
          }
          
          // Veya combo'yu sıfırlamayı dene
          translateElement.value = '';
          translateElement.dispatchEvent(new Event('change'));
        }
      }, 500);
      
      // console.log("✅ Google Translate triggered");
    } else {
      // console.log("❌ Google Translate element not found, using cookie + reload method");
      
      // Cookie method ile dil değiştir
      if (langCode === 'en') {
        document.cookie = "googtrans=/tr/en; path=/; domain=" + window.location.hostname;
      } else {
        document.cookie = "googtrans=/tr/tr; path=/; domain=" + window.location.hostname;
      }
      
      // console.log("🍪 Cookie set, reloading page...");
      
      // Sayfayı yeniden yükle
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
      return; // Early return, URL temizleme işlemini yapma
    }

    const cleanUrl = () => {
      if (window.location.hash.includes('googtrans')) {
        const newUrl = window.location.pathname + window.location.search;
        window.history.replaceState(null, null, newUrl);
      }
    };

    setTimeout(cleanUrl, 100);
    setTimeout(cleanUrl, 500);
    setTimeout(cleanUrl, 1000);
    setTimeout(() => setIsTranslating(false), 1500);
  };

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
    forceUpdate // Header'ın re-render olması için
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
