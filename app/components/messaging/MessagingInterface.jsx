"use client";
import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

export default function MessagingInterface() {
  const { user } = useAuthContext();
  const router = useRouter();

  // Kullanıcı giriş yapmamışsa gösterme
  if (!user) return null;

  const handleOpenMessages = () => {
    router.push('/dashboard/messages');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleOpenMessages}
        className="bg-primary-500 hover:bg-primary-600 text-black p-4 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 border-2 border-primary-400"
        title="Mesajları Aç"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}
