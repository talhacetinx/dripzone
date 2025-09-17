"use client";
import { Suspense } from 'react';
import MessagesPageContent from './MessagesPageContent';

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Mesajlar yükleniyor...</p>
        </div>
      </div>
    }>
      <MessagesPageContent />
    </Suspense>
  );
}
