"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X, User, LogOut, Settings, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  
  const { user: AuthUser, logout, loading } = useAuth();
  const { currentLanguage, changeLanguage, languages, isTranslating } = useLanguage();

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setShowLanguageMenu(false);
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
                  <Link href="/messages" className="text-white hover:text-primary-400">Mesajlar</Link>
                  {profile.user_type === "artist" && (
                    <Link href="/orders" className="text-white hover:text-primary-400">Siparişler</Link>
                  )}

                  {/* Language Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                      className="flex items-center space-x-2 p-2 hover:bg-primary-500/10 rounded-xl transition"
                    >
                      <Globe className="w-5 h-5 text-white" />
                      <span className="text-2xl">{languages.find(lang => lang.code === currentLanguage)?.flag}</span>
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
                          {languages.map((language) => (
                            <button
                              key={language.code}
                              onClick={() => handleLanguageChange(language.code)}
                              className={`flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-800 transition ${
                                currentLanguage === language.code ? 'bg-gray-800 text-primary-400' : 'text-white'
                              }`}
                            >
                              <span className="text-xl">{language.flag}</span>
                              <span>{language.name}</span>
                              {currentLanguage === language.code && (
                                <span className="ml-auto text-primary-400">✓</span>
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
                      className="flex items-center space-x-2 p-2 hover:bg-primary-500/10 rounded-xl transition mr-4"
                    >
                      <Globe className="w-5 h-5 text-white" />
                      <span className="text-2xl">{languages.find(lang => lang.code === currentLanguage)?.flag}</span>
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
                          {languages.map((language) => (
                            <button
                              key={language.code}
                              onClick={() => handleLanguageChange(language.code)}
                              className={`flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-800 transition ${
                                currentLanguage === language.code ? 'bg-gray-800 text-primary-400' : 'text-white'
                              }`}
                            >
                              <span className="text-xl">{language.flag}</span>
                              <span>{language.name}</span>
                              {currentLanguage === language.code && (
                                <span className="ml-auto text-primary-400">✓</span>
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
                    <Link href="/messages" className="block px-4 py-3 text-white hover:text-primary-400" onClick={() => setIsMenuOpen(false)}>
                      Mesajlar
                    </Link>
                    {profile.user_type === "artist" && (
                      <Link href="/orders" className="block px-4 py-3 text-white hover:text-primary-400" onClick={() => setIsMenuOpen(false)}>
                        Siparişler
                      </Link>
                    )}
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
