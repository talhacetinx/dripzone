"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function NewPasswordPageComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const authCode = searchParams.get("authCode");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Şifreler eşleşiyor mu kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      toast.error("Şifreler eşleşmiyor");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, email, authCode }),
      });

        const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        setError(data.message || "İşlem başarısız");
        toast.error(data.message || "İşlem başarısız");
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
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back!</h1>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg p-0">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-white">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-white">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-yellow-glow ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {isLoading ? "Şifre Yenileniyor..." : "Şifre Yenile"}
            </button>

            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary-400 hover:text-primary-300 font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}