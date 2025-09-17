"use client";
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import ConversationsList from '../../components/messaging/ConversationsList';
import ChatArea from '../../components/messaging/ChatArea';

export default function MessagesPageContent() {
  const { user } = useAuthContext();
  const { socket } = useSocket();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Konuşmalar getiriliyor...');
      const response = await fetch('/api/messages/conversations');
      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        setConversations(data.conversations || []);
      } else {
        console.error('API hatası:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Konuşmalar yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleNewMessage = useCallback((message) => {
    // Konuşmalar listesini güncelle
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === message.conversationId) {
          return {
            ...conv,
            lastMessage: message.content,
            lastMessageAt: message.createdAt
          };
        }
        return conv;
      })
    );
  }, []);

  const handleNewConversation = useCallback((newConversation) => {
    console.log('🆕 handleNewConversation çağrıldı:', newConversation);
    
    // Yeni konuşmayı listeye ekle
    setConversations(prev => {
      const exists = prev.find(conv => conv.id === newConversation.id);
      if (exists) {
        console.log('⚠️ Konuşma zaten mevcut:', newConversation.id);
        return prev; // Zaten varsa ekleme
      }
      console.log('✅ Yeni konuşma listeye ekleniyor:', newConversation.id);
      return [newConversation, ...prev];
    });
    
    // Yeni konuşmayı seç
    console.log('🎯 Yeni konuşma seçiliyor:', newConversation.id);
    setSelectedConversation(newConversation);
    
    // Konuşmaları yeniden yükle (opsiyonel, çünkü zaten state güncelledik)
    // fetchConversations();
  }, []);

  // URL'den 'to' parametresi varsa otomatik konuşma başlat
  const startConversationWithUser = useCallback(async (targetUsername) => {
    if (!targetUsername || !user) return;

    try {
      console.log('🔄 Yeni konuşma başlatılıyor:', targetUsername);
      console.log('📝 Mevcut konuşmalar:', conversations);
      
      // Önce mevcut konuşmalarda bu kullanıcı var mı kontrol et
      const existingConv = conversations.find(conv => 
        conv?.otherUser?.user_name === targetUsername
      );

      if (existingConv) {
        console.log('✅ Mevcut konuşma bulundu:', existingConv);
        setSelectedConversation(existingConv);
        return;
      }

      console.log('🆕 Mevcut konuşma bulunamadı, yeni konuşma başlatılıyor...');

      // Yeni konuşma başlat
      const response = await fetch('/api/messages/start-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientUsername: targetUsername
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Yeni konuşma başlatıldı:', data);
        
        if (data.conversation) {
          handleNewConversation(data.conversation);
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Konuşma başlatılamadı:', response.status, errorData);
      }
    } catch (error) {
      console.error('❌ Konuşma başlatma hatası:', error);
    }
  }, [conversations, user, handleNewConversation]);

  // Konuşmaları yükle
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  // URL'den 'to' parametresini kontrol et ve otomatik konuşma başlat
  useEffect(() => {
    const toParam = searchParams.get('to');
    if (toParam && user && conversations.length > 0 && !isLoading) {
      console.log('🎯 URL\'den to parametresi alındı:', toParam);
      console.log('📊 Konuşmalar yüklendi, konuşma başlatılıyor...');
      
      // Kısa bir gecikme ile konuşma başlat (UI render'ı tamamlansın diye)
      setTimeout(() => {
        startConversationWithUser(toParam);
        
        // URL'den parametreyi temizle
        const url = new URL(window.location);
        url.searchParams.delete('to');
        window.history.replaceState({}, '', url);
      }, 100);
    }
  }, [searchParams, user, conversations, isLoading, startConversationWithUser]);

  // Socket.io dinleyicileri
  useEffect(() => {
    if (!socket) return;

    // Yeni mesaj geldiğinde konuşmalar listesini güncelle
    socket.on('new_message', (messageData) => {
      console.log('🔔 Yeni mesaj alındı:', messageData);
      
      setConversations(prev => {
        // Mevcut konuşma var mı kontrol et
        const existingConvIndex = prev.findIndex(conv => conv.id === messageData.conversationId);
        
        if (existingConvIndex !== -1) {
          // Mevcut konuşmayı güncelle
          const updatedConversations = [...prev];
          updatedConversations[existingConvIndex] = {
            ...updatedConversations[existingConvIndex],
            lastMessage: messageData.content,
            lastMessageAt: messageData.createdAt,
            unreadCount: selectedConversation?.id === messageData.conversationId ? 0 : (updatedConversations[existingConvIndex].unreadCount || 0) + 1
          };
          
          // Güncellenmiş konuşmayı en üste taşı
          const updatedConv = updatedConversations.splice(existingConvIndex, 1)[0];
          return [updatedConv, ...updatedConversations];
        } else {
          // Yeni konuşma ise conversations'ları yeniden yükle
          console.log('🔄 Yeni konuşma algılandı, liste yenileniyor...');
          fetchConversations();
          return prev;
        }
      });
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket, selectedConversation, fetchConversations]);

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center text-white text-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Mesajlara erişim için giriş yapmalısınız</h2>
            <p className="text-gray-400">Lütfen giriş yapın</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black">
        {/* Container - Ortalanmış ve Dashboard genişliği */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Mesajlar</h1>
            <p className="text-gray-400">Konuşmalarınızı yönetin</p>
          </div>

          {/* Main Content */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="flex h-[600px] relative">
              {/* Conversations List - Sol Panel (%30) - Her zaman görünür */}
              <div className="w-[30%] border-r border-gray-800 flex flex-col shrink-0">
                <ConversationsList
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  onConversationSelect={handleConversationSelect}
                  onNewConversation={handleNewConversation}
                  isLoading={isLoading}
                />
              </div>

              {/* Chat Area - Sağ Panel (%70) */}
              <div className="w-[70%] flex flex-col">
                {selectedConversation ? (
                  <ChatArea
                    conversation={selectedConversation}
                    onNewMessage={handleNewMessage}
                    isMobile={false}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-900 text-white">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">Konuşma Seçin</h3>
                      <p className="text-gray-400">Mesajlaşmaya başlamak için bir konuşma seçin</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Overlay - Sadece küçük ekranlarda */}
              {selectedConversation && (
                <div className="md:hidden absolute inset-0 bg-gray-900 z-10 flex flex-col">
                  <ChatArea
                    conversation={selectedConversation}
                    onNewMessage={handleNewMessage}
                    onBack={() => setSelectedConversation(null)}
                    isMobile={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}