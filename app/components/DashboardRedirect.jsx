"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export const DashboardRedirect = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Kullanıcı giriş yapmışsa dashboard'a yönlendir
        router.push('/dashboard');
      } else {
        // Kullanıcı giriş yapmamışsa login'e yönlendir
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white">Yönlendiriliyor...</p>
        </div>
      </div>
    );
  }

  return null;
};