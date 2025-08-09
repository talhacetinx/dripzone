// Basit çeviri sistemi - Google Translate alternatifi
export const translations = {
  tr: {
    // Navigation
    "dashboard": "Kontrol Paneli",
    "messages": "Mesajlar", 
    "orders": "Siparişler",
    "logout": "Çıkış Yap",
    "login": "Giriş Yap",
    "register": "Kayıt Ol",
    
    // Common
    "home": "Ana Sayfa",
    "about": "Hakkımızda",
    "contact": "İletişim",
    "services": "Hizmetler",
    "artists": "Sanatçılar",
    "providers": "Sağlayıcılar",
    
    // Profile
    "profile": "Profil",
    "settings": "Ayarlar",
    "edit_profile": "Profili Düzenle",
    "save": "Kaydet",
    "cancel": "İptal",
    
    // Forms
    "email": "E-posta",
    "password": "Şifre",
    "confirm_password": "Şifreyi Onayla",
    "first_name": "Ad",
    "last_name": "Soyad",
    "phone": "Telefon",
    "country": "Ülke"
  },
  
  en: {
    // Navigation
    "dashboard": "Dashboard",
    "messages": "Messages",
    "orders": "Orders", 
    "logout": "Logout",
    "login": "Login",
    "register": "Register",
    
    // Common
    "home": "Home",
    "about": "About",
    "contact": "Contact",
    "services": "Services", 
    "artists": "Artists",
    "providers": "Providers",
    
    // Profile
    "profile": "Profile",
    "settings": "Settings",
    "edit_profile": "Edit Profile",
    "save": "Save",
    "cancel": "Cancel",
    
    // Forms
    "email": "Email",
    "password": "Password", 
    "confirm_password": "Confirm Password",
    "first_name": "First Name",
    "last_name": "Last Name",
    "phone": "Phone",
    "country": "Country"
  }
};

export const t = (key, lang = 'tr') => {
  return translations[lang]?.[key] || translations['tr']?.[key] || key;
};
