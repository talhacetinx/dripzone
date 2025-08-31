"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Settings, Globe, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useSocket } from "../context/SocketContext";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  const { user: AuthUser, logout, loading } = useAuth();
  const { socket } = useSocket();

  const { currentLanguage, changeLanguage, languages, isTranslating, forceUpdate } = useLanguage();

  // Aktif dili en başa al (her yerde aynı mantık)
  const getSortedLanguages = (langs, activeCode) => {
    if (!langs) return [];
    const active = langs.find(l => l.code === activeCode);
    const rest = langs.filter(l => l.code !== activeCode);
    return active ? [active, ...rest] : langs;
  };
  const sortedLanguages = getSortedLanguages(languages, currentLanguage);

  // Debug log
  useEffect(() => {
    // console.log("🌐 Header Language Context:", {
    //   currentLanguage,
    //   sortedLanguages,
    //   isTranslating,
    //   forceUpdate,
    //   flag: sortedLanguages[0]?.flag
    // });
  }, [currentLanguage, forceUpdate, sortedLanguages]);

  // Socket mesaj bildirimi dinleyicisi
  useEffect(() => {
    if (!socket || !AuthUser) return;

    const handleNewMessage = (messageData) => {
      // Sadece kendi mesajımız değilse bildirim göster
      if (messageData.senderId !== AuthUser.id) {
        setUnreadMessages(prev => prev + 1);
        console.log('🔔 Yeni mesaj bildirimi:', messageData.content);
      }
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, AuthUser]);

  const handleLanguageChange = (langCode) => {
    // console.log("🔄 Changing language to:", langCode);
    changeLanguage(langCode);
    setShowLanguageMenu(false);
    // sortedLanguages zaten currentLanguage değişince güncellenecek
  };

  const isLoggedIn = !!AuthUser && !loading;

  const profile = {
    avatar_url: AuthUser?.user_photo || AuthUser?.image || AuthUser?.avatarUrl || null,
    full_name: AuthUser?.user_name || AuthUser?.name || AuthUser?.full_name || "Kullanıcı",
    user_type: AuthUser?.role?.toLowerCase() || "artist",
  };

  const isAdmin = AuthUser?.role === 'admin';

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      <header className="bg-black/80 backdrop-blur-xl border-b border-primary-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                className="flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src="/TpazLayer 2-topaz-enhance-min.png"
                  alt="Dripzone Logo"
                  className="h-12 w-auto object-contain filter drop-shadow-lg"
                />
              </motion.div>
            </Link>

            {/* Desktop */}
            <div className="hidden lg:flex items-center space-x-6">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="text-white hover:text-primary-400">Kontrol Paneli</Link>
                  
                  {/* Mesajlar - Bildirim ile */}
                  <Link 
                    href="/dashboard/messages" 
                    className="relative text-white hover:text-primary-400 flex items-center"
                    onClick={() => setUnreadMessages(0)}
                  >
                    <MessageCircle className="w-5 h-5 mr-1" />
                    Mesajlar
                    {unreadMessages > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </span>
                    )}
                  </Link>
                  
                  {profile.user_type === "artist" && (
                    <Link href="/orders" className="text-white hover:text-primary-400">Siparişler</Link>
                  )}
                  
                  {/* Dashboard Link - Her zaman görünür */}
                  <Link href="/dashboard" className="px-4 py-2 bg-primary-600 text-black rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                    Dashboard
                  </Link>

                  {/* Language Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                      className={`flex items-center space-x-2 p-2 rounded-xl transition ${
                        currentLanguage === 'en' 
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                          : 'hover:bg-primary-500/10'
                      }`}
                    >
                      <Globe className="w-5 h-5 text-white" />
                      <span className="text-2xl text-white ml-2">{sortedLanguages[0]?.flag}</span>
                    </button>
                    <AnimatePresence>
                      {showLanguageMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 z-50"
                        >
                          {sortedLanguages.map((language) => (
                            <button
                              key={language.code}
                              onClick={() => handleLanguageChange(language.code)}
                              className={`flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-800 transition ${
                                currentLanguage === language.code ? 'bg-primary-500/20 text-primary-400 border-l-4 border-primary-500' : 'text-white'
                              }`}
                            >
                              <span className="text-xl">{language.flag}</span>
                              <span>{language.name}</span>
                              {currentLanguage === language.code && (
                                <span className="ml-auto text-primary-400 font-bold">✓</span>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 p-2 hover:bg-primary-500/10 rounded-xl transition"
                    >
                      <img
                        src={
                          profile.avatar_url ||
                          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50"
                        }
                        alt={profile.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-white font-medium">{profile.full_name}</span>
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-lg py-2"
                        >
                          <Link
                            href="/profile"
                            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="w-4 h-4" />
                            <span>Profil</span>
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Ayarlar</span>
                          </Link>
                          <hr className="my-2 border-gray-700" />
                          <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Çıkış Yap</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  {/* Language Selector for non-logged users */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                      className={`flex items-center space-x-2 p-2 rounded-xl transition mr-4 ${
                        currentLanguage === 'en' 
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                          : 'hover:bg-primary-500/10'
                      }`}
                    >
                      <Globe className="w-5 h-5 text-white" />
                      <span className="text-2xl text-white ml-2">{sortedLanguages[0]?.flag}</span>
                    </button>
                    <AnimatePresence>
                      {showLanguageMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 z-50"
                        >
                          {sortedLanguages.map((language) => (
                            <button
                              key={language.code}
                              onClick={() => handleLanguageChange(language.code)}
                              className={`flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-800 transition ${
                                currentLanguage === language.code ? 'bg-primary-500/20 text-primary-400 border-l-4 border-primary-500' : 'text-white'
                              }`}
                            >
                              <span className="text-xl">{language.flag}</span>
                              <span>{language.name}</span>
                              {currentLanguage === language.code && (
                                <span className="ml-auto text-primary-400 font-bold">✓</span>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <Link href="/register" className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-black font-semibold rounded-xl border-2 border-primary-500 shadow-yellow-glow">
                    Kayıt Ol
                  </Link>
                  <Link href="/login" className="px-6 py-3 text-white font-semibold hover:text-primary-400">Giriş Yap</Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl hover:bg-primary-500/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden border-t border-primary-500/20 py-6"
              >
                {isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-gray-800/30 rounded-lg">
                      <img
                        src={
                          profile.avatar_url ||
                          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50"
                        }
                        alt={profile.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-white">{profile.full_name}</div>
                        <div className="text-sm text-gray-400 capitalize">{profile.user_type}</div>
                      </div>
                    </div>

                    <Link href="/dashboard" className="block px-4 py-3 text-white hover:text-primary-400" onClick={() => setIsMenuOpen(false)}>
                      Kontrol Paneli
                    </Link>
                    
                    {/* Mesajlar - Mobil */}
                    <Link 
                      href="/dashboard/messages" 
                      className="relative flex items-center px-4 py-3 text-white hover:text-primary-400" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        setUnreadMessages(0);
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Mesajlar
                      {unreadMessages > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          {unreadMessages > 9 ? '9+' : unreadMessages}
                        </span>
                      )}
                    </Link>
                    
                    {profile.user_type === "artist" && (
                      <Link href="/orders" className="block px-4 py-3 text-white hover:text-primary-400" onClick={() => setIsMenuOpen(false)}>
                        Siparişler
                      </Link>
                    )}
                    
                    {/* Dashboard Link - Mobile */}
                    <Link href="/dashboard" className="block px-4 py-3 bg-primary-600 text-black rounded-lg hover:bg-primary-700 transition-colors font-semibold mx-4 text-center" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                    
                    <Link href="/profile" className="block px-4 py-3 text-white hover:text-primary-400" onClick={() => setIsMenuOpen(false)}>
                      Profil
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="block px-4 py-3 text-white hover:text-primary-400" onClick={() => setIsMenuOpen(false)}>
                        Admin Paneli
                      </Link>
                    )}
                    
                    {/* Mobile Language Selector */}
                    <div className="px-4 py-3">
                      <div className="text-gray-400 text-sm mb-2">Dil Seçin</div>
                      <div className="flex space-x-2">
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => {
                              changeLanguage(language.code);
                              setIsMenuOpen(false);
                            }}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${
                              currentLanguage === language.code 
                                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                          >
                            <span className="text-lg">{language.flag}</span>
                            <span className="text-sm">{language.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-3 text-red-400 hover:text-red-300">
                      Çıkış Yap
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Mobile Language Selector for non-logged users */}
                    <div className="px-4 py-3">
                      <div className="text-gray-400 text-sm mb-2">Dil Seçin</div>
                      <div className="flex space-x-2">
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => {
                              changeLanguage(language.code);
                              setIsMenuOpen(false);
                            }}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${
                              currentLanguage === language.code 
                                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                          >
                            <span className="text-lg">{language.flag}</span>
                            <span className="text-sm">{language.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <Link href="/register" className="block w-full px-6 py-4 text-center bg-gradient-to-r from-primary-500 to-primary-400 text-black font-semibold rounded-xl border-2 border-primary-500 shadow-yellow-glow" onClick={() => setIsMenuOpen(false)}>
                      Kayıt Ol
                    </Link>
                    <Link href="/login" className="block w-full px-6 py-4 text-center text-white font-semibold hover:text-primary-400" onClick={() => setIsMenuOpen(false)}>
                      Giriş Yap
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
};
