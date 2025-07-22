import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { type } = useParams<{ type: 'login' | 'register' }>();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'artist';
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: userType,
    agreeTerms: false
  });

  const isLogin = type === 'login';
  const isRegister = type === 'register';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        // Handle login
        console.log('Login successful:', { email: formData.email });
        // Redirect to dashboard or home
      } else {
        // Handle registration
        console.log('Registration successful:', formData);
        // Redirect to welcome page or dashboard
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-primary-500/30 rounded-2xl p-8 shadow-yellow-glow"
        >
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center mb-6">
              <img 
                src="/TpazLayer 2-topaz-enhance-min.png" 
                alt="Dripzone Logo" 
                className="h-12 w-auto object-contain filter drop-shadow-lg"
              />
            </Link>
            
            <h1 className="text-3xl font-bold mb-2 text-white">
              {isLogin ? 'Welcome Back!' : 'Join Dripzone'}
            </h1>
            <p className="text-gray-300">
              {isLogin 
                ? 'Continue your music journey' 
                : userType === 'artist' 
                  ? 'Register as an Artist' 
                  : 'Register as a Service Provider'
              }
            </p>
          </div>

          {/* User Type Selector (Only for Register) */}
          {isRegister && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-white">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'artist' }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.userType === 'artist'
                      ? 'border-primary-500 bg-primary-500/20 shadow-yellow-glow'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎵</div>
                    <div className="font-semibold text-white">Artist</div>
                    <div className="text-xs text-gray-400">Buy services</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'provider' }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.userType === 'provider'
                      ? 'border-primary-500 bg-primary-500/20 shadow-yellow-glow'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎙️</div>
                    <div className="font-semibold text-white">Provider</div>
                    <div className="text-xs text-gray-400">Sell services</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields (Register Only) */}
            {isRegister && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-white">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-white">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                      placeholder="Your surname"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-white">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            {/* Phone (Register Only) */}
            {isRegister && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1 text-white">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                    placeholder="+90 (555) 123 45 67"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Register Only) */}
            {isRegister && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-white">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Terms (Register Only) */}
            {isRegister && (
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                  required
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-400 hover:text-primary-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-400 hover:text-primary-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-yellow-glow disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </motion.button>

            {/* Forgot Password (Login Only) */}
            {isLogin && (
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-400 hover:text-primary-300"
                >
                  Forgot Password?
                </Link>
              </div>
            )}
          </form>

          {/* Switch Form */}
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <Link
                to={isLogin ? '/auth/register' : '/auth/login'}
                className="text-primary-400 hover:text-primary-300 font-semibold"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};