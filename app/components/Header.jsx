"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";

export const Header = ({ AuthUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

const isLoggedIn = !!AuthUser;

const profile = {
  avatar_url: AuthUser?.image || null,
  full_name: AuthUser?.name || "Kullanıcı",
  user_type: AuthUser?.role?.toLowerCase() || "artist",
};

  const handleSignOut = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
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
                  <Link href="/dashboard" className="text-white hover:text-primary-400">Dashboard</Link>
                  <Link href="/messages" className="text-white hover:text-primary-400">Messages</Link>
                  {profile.user_type === "artist" && (
                    <Link href="/orders" className="text-white hover:text-primary-400">Orders</Link>
                  )}

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
                            <span>Profile</span>
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                          <hr className="my-2 border-gray-700" />
                          <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/register" className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-black font-semibold rounded-xl border-2 border-primary-500 shadow-yellow-glow">
                    Sign up
                  </Link>
                  <Link href="/login" className="px-6 py-3 text-white font-semibold hover:text-primary-400">Login</Link>
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
                      Dashboard
                    </Link>
                    <Link href="/messages" className="block px-4 py-3 text-white hover:text-primary-400" onClick={() => setIsMenuOpen(false)}>
                      Messages
                    </Link>
                    {profile.user_type === "artist" && (
                      <Link href="/orders" className="block px-4 py-3 text-white hover:text-primary-400" onClick={() => setIsMenuOpen(false)}>
                        Orders
                      </Link>
                    )}
                    <Link href="/profile" className="block px-4 py-3 text-white hover:text-primary-400" onClick={() => setIsMenuOpen(false)}>
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="block px-4 py-3 text-white hover:text-primary-400" onClick={() => setIsMenuOpen(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-3 text-red-400 hover:text-red-300">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link href="/register" className="block w-full px-6 py-4 text-center bg-gradient-to-r from-primary-500 to-primary-400 text-black font-semibold rounded-xl border-2 border-primary-500 shadow-yellow-glow" onClick={() => setIsMenuOpen(false)}>
                      Sign up
                    </Link>
                    <Link href="/login" className="block w-full px-6 py-4 text-center text-white font-semibold hover:text-primary-400" onClick={() => setIsMenuOpen(false)}>
                      Login
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