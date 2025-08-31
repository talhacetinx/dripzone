"use client";

import { useAuthContext } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export default function TestMessaging() {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Konuşmalar getirilemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Mesajlaşma Testi</h1>
          <p className="text-gray-600">Lütfen önce giriş yapın</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mesajlaşma Sistemi Testi</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Kullanıcı Bilgileri</h2>
          <div className="flex items-center space-x-4">
            <img
              src={user.user_photo || '/default-avatar.png'}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">@{user.user_name} • {user.role}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Konuşmalarınız ({conversations.length})
          </h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-sm mt-2">Yükleniyor...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Henüz konuşmanız yok</p>
              <p className="text-xs">Mesajlaşma butonu ile yeni konuşma başlatabilirsiniz</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <img
                    src={conversation.otherUser.user_photo || '/default-avatar.png'}
                    alt={conversation.otherUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-900">
                        {conversation.otherUser.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessageAt && 
                          new Date(conversation.lastMessageAt).toLocaleDateString('tr-TR')
                        }
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {conversation.lastMessage || 'Henüz mesaj yok'}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="ml-2 bg-primary-600 text-white text-xs rounded-full min-w-[18px] h-4 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
