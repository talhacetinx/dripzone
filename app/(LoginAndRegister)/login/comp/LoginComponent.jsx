"use client";

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiMail, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Link from 'next/link'; 

export default function LoginPageComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.ok) {
      router.refresh();

      await new Promise(resolve => setTimeout(resolve, 500));
      const session = await getSession();
      const role = session?.user?.role;

      toast.success("Giriş başarılı!");

      if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      toast.error("Hatalı giriş.");
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
          {/* Logo & Title */}
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

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-lg p-0"
          >
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

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-yellow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600'
              } text-black font-semibold`}
            >
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>

            <div className="text-center mt-3">
              <Link href="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300" >Forgot Password?</Link>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-300">Don't have an account? <Link href="/register" className="text-primary-400 hover:text-primary-300 font-semibold">Sign Up</Link></p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}