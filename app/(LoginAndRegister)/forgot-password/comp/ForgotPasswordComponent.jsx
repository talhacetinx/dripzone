"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiMail, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPasswordComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success("Giriş başarılı!");

//         await new Promise((r) => setTimeout(r, 1500));

//         if (data?.user?.role === "ADMIN") {
//           window.location.href = "/admin";
//         } else {
//           window.location.href = "/dashboard";
//         }


//       } else {
//         setError(data?.error || "Giriş başarısız");
//         toast.error(data?.error || "Hatalı giriş");
//       }

//     } catch (err) {
//       setError("Sunucu hatası");
//       toast.error("Sunucu hatası");
//     }

//     setIsLoading(false);
//   };
    const handleSubmit = async(e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.target))
        
        try {
            const response = await fetch("/api/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email }),
            });

            const json = await response.json(); 

            if (json.success) {
            toast.info(json.message);
            } else {
            toast.error(json.message);
            }
        } catch (error) {
            console.error("Hata:", error);
            toast.error("Bir hata oluştu.");
        }
        
    }
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
            <p className="text-lg text-center text-white mb-2">Şifre yenilemek için email adresinizi giriniz.</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg p-0">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-white">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-yellow-glow ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Şifre Yenileme isteği gönder"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}