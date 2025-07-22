'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { ArtistDashboard } from './ArtistDashboard';
import { ProviderDashboard } from './ProviderDashboard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';


export function DashboardRouter() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Oturum bulunamadı</h2>
          <p className="text-gray-400">Lütfen giriş yapın</p>
        </div>
      </div>
    );
  }

  const role = session.user.role;

  console.log(role);
  

  if (role === 'PROVIDER') {
    return(
      <>
        <Header />
        <ProviderDashboard />
        <Footer />
      </>
    );
  }

  if (role === 'ARTIST') {
    return(
      <>
        <Header />
        <ArtistDashboard />        
        <Footer />
      </>
    )  
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white text-center">
      <div>
        <h2 className="text-xl font-semibold mb-2">Yetki bulunamadı</h2>
        <p className="text-gray-400">Tanımsız rol</p>
      </div>
    </div>
  );
}