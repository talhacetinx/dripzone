"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("tr");
  const [isTranslating, setIsTranslating] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("🔄 Language state changed:", currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    if (isInitialized) return;

    const detectCurrentLanguage = () => {
      if (typeof window !== "undefined") {
        const cookies = document.cookie;
        const googTransMatch = cookies.match(/googtrans=([^;]*)/);
        const bodyTranslated = document.body.className.includes("translated-ltr");

        let detectedLang = "tr";

        if (googTransMatch) {
          const cookieValue = googTransMatch[1];
          if (cookieValue.includes("/en") || cookieValue === "/tr/en") {
            detectedLang = "en";
          }
        }

        if (bodyTranslated) {
          detectedLang = "en";
        }

        if (detectedLang !== currentLanguage) {
          setCurrentLanguage(detectedLang);
        }

        setIsInitialized(true);
      }
    };

    detectCurrentLanguage();
  }, []);

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (typeof window !== "undefined") {
        const existingScript = document.querySelector('script[src*="translate.google.com"]');

        if (!existingScript && !window.google?.translate) {
          const script = document.createElement("script");
          script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);

          window.googleTranslateElementInit = () => {
            try {
              if (window.google?.translate) {
                new window.google.translate.TranslateElement(
                  {
                    pageLanguage: "tr",
                    includedLanguages: "tr,en",
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                  },
                  "google_translate_element"
                );

                setTimeout(hideGoogleTranslateElements, 500);
                setTimeout(() => {
                  const combo = document.querySelector(".goog-te-combo");
                  if (combo) setupTranslateObserver();
                }, 1000);
              }
            } catch (error) {
              console.error("❌ Google Translate init error:", error);
            }
          };
        }
      }
    };

    const hideGoogleTranslateElements = () => {
      const selectors = [
        ".goog-te-banner-frame",
        ".goog-te-menu-frame",
        ".goog-te-ftab",
        ".goog-te-balloon-frame",
        ".goog-te-spinner-pos",
        'div[id^="goog-gt-"]',
        ".VIpgJd-ZVi9od-aZ2wEe-wOHMyf",
        ".VIpgJd-ZVi9od-xl07Ob-lTBxed",
        ".VIpgJd-ZVi9od-ORHb-OEVmcd",
        'iframe[src*="translate.google"]',
      ];

      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          el.style.display = "none";
          el.style.visibility = "hidden";
        });
      });
    };

    const setupTranslateObserver = () => {
      const observer = new MutationObserver(() => hideGoogleTranslateElements());
      observer.observe(document.body, { childList: true, subtree: true });

      const cleanupInterval = setInterval(hideGoogleTranslateElements, 2000);
      setTimeout(() => {
        clearInterval(cleanupInterval);
        observer.disconnect();
      }, 30000);
    };

    addGoogleTranslateScript();
    setTimeout(hideGoogleTranslateElements, 2000);
  }, []);

  // ✅ URL temiz kalır, TR dönüşte tüm kalıntılar temizlenir
  const changeLanguage = (langCode) => {
    console.log("🔧 changeLanguage called:", langCode);

    const domain = window.location.hostname;
    const rootDomain = domain.split(".").slice(-2).join(".");

    if (langCode === currentLanguage) {
      console.log("⚠️ Same language selected, skipping...");
      return;
    }

    setIsTranslating(true);
    setCurrentLanguage(langCode);

    if (langCode === "tr") {
      console.log("🔄 Switching back to Turkish...");

      const cookiesToClear = [
        `googtrans=; path=/; max-age=0`,
        `googtrans=; path=/; domain=${domain}; max-age=0`,
        `googtrans=; path=/; domain=.${domain}; max-age=0`,
        `googtrans=; path=/; domain=${rootDomain}; max-age=0`,
        `googtrans=; path=/; domain=.${rootDomain}; max-age=0`,
        `googtrans=/tr/tr; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        `googtrans=/tr/en; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      ];

      cookiesToClear.forEach((c) => (document.cookie = c));

      document.body.classList.remove("translated", "translated-ltr", "translated-rtl");
      document.documentElement.classList.remove("translated", "translated-ltr", "translated-rtl");
      document.documentElement.lang = "tr";

      try {
        localStorage.removeItem("googtrans");
        sessionStorage.removeItem("googtrans");
      } catch {}

      console.log("🍪 Cookies & classes cleared (TR mode)");

      // ✅ Sadece hard reload — URL aynı kalır
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } else {
      console.log("🔄 Switching to English...");
      const cookieValue = "/tr/en";
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}; max-age=31536000`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${domain}; max-age=31536000`;

      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  };

  const languages = [
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const value = {
    currentLanguage,
    setCurrentLanguage,
    changeLanguage,
    languages,
    isTranslating,
    forceUpdate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
      <div
        id="google_translate_element"
        style={{
          position: "absolute",
          left: "-9999px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </LanguageContext.Provider>
  );
};