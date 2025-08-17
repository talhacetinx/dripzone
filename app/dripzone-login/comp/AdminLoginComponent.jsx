"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff } from "lucide-react";
import { FiMail, FiLock } from "react-icons/fi";

export default function AdminLoginComponent(){
  const [accessKey, setAccessKey] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "", accessKey });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, accessKey }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Giriş başarılı!");

        await new Promise((r) => setTimeout(r, 1500));

        if (data?.user?.role === "ADMIN") {
          window.location.href = "/admin";
        } else {
          toast.error("Admin yetkisi gerekli");
        }


      } else {
        setError(data?.error || "Giriş başarısız");
        toast.error(data?.error || "Hatalı giriş");
      }

    } catch (err) {
      setError("Sunucu hatası");
      toast.error("Sunucu hatası");
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-primary-500/30 rounded-2xl p-8 shadow-yellow-glow"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-6">
              <img
                src="/TpazLayer 2-topaz-enhance-min.png"
                alt="Dripzone Logo"
                className="h-12 w-auto object-contain filter drop-shadow-lg"
              />
            </Link>
            <h1 className="text-3xl font-bold mb-2 text-white">Tekrar Hoş Geldiniz!</h1>
          </div>

           <form onSubmit={handleLogin} className="space-y-6">
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-white">E-posta</label>
                <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                    placeholder="E-posta adresinizi girin"
                    required
                />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-white">Şifre</label>
                <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                    placeholder="Şifrenizi girin"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400"
                >
                    {showPassword ? "Gizle" : "Göster"}
                </button>
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Access Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Access key'inizi girin"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !accessKey}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Doğrulanıyor...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Admin Girişi</span>
                </>
              )}
            </button>
          </form>

        </motion.div>
      </div>
    </div>
    )
}