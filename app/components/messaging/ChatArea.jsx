"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, ArrowLeft, User, MoreVertical, Smile, ExternalLink, Package, X, UserX, AlertTriangle } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Link from 'next/link';

export default function ChatArea({ conversation, onNewMessage, onBack, isMobile = false }) {
  const { user } = useAuthContext();
  const { socket, onlineUsers, joinConversation } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [userPackages, setUserPackages] = useState([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [showPackageWarning, setShowPackageWarning] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [showBlockedWarning, setShowBlockedWarning] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState('');
  const [isUserBlocked, setIsUserBlocked] = useState(false); // Yeni state
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const moreMenuRef = useRef(null);

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mesajları yükle
  const fetchMessages = useCallback(async () => {
    if (!conversation?.id) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/messages/conversation/${conversation.id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Mesajlar yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  }, [conversation?.id]);

  // Kullanıcının paketlerini yükle
  const fetchUserPackages = useCallback(async () => {
    if (!user?.id || user?.role !== 'PROVIDER') return;
    
    try {
      setIsLoadingPackages(true);
      const response = await fetch(`/api/user/packages/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        const packages = data.packages || [];
        setUserPackages(packages);
        
        // Eğer paket yoksa uyarı göster
        if (packages.length === 0) {
          setShowPackageWarning(true);
          return;
        }
        
        // Paket varsa modal'ı aç
        setShowPackageModal(true);
      }
    } catch (error) {
      console.error('Paketler yüklenemedi:', error);
      setShowPackageWarning(true);
    } finally {
      setIsLoadingPackages(false);
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    fetchMessages();
    // Conversation room'una join ol
    if (joinConversation && conversation?.id) {
      joinConversation(conversation.id);
    }
  }, [fetchMessages, joinConversation, conversation?.id]);

  // Socket dinleyicileri
  useEffect(() => {
    if (!socket || !conversation?.id) return;

    const handleUserTyping = (data) => {
      if (data.userId !== user.id && data.conversationId === conversation.id) {
        setOtherUserTyping(data.isTyping);
      }
    };

    const handleNewMessage = (messageData) => {
      if (messageData.conversationId === conversation.id && messageData.senderId !== user.id) {
        // Package data'yı parse et
        if (messageData.packageData && typeof messageData.packageData === 'string') {
          try {
            messageData.packageData = JSON.parse(messageData.packageData);
          } catch (error) {
            console.error('Package data parse hatası:', error);
            messageData.packageData = null;
          }
        }
        
        setMessages(prev => {
          const messageExists = prev.some(msg => msg.id === messageData.id);
          if (messageExists) return prev;
          return [...prev, messageData];
        });
        if (onNewMessage) {
          onNewMessage(messageData);
        }
      }
    };

    // Yazıyor durumu dinleyicisi
    socket.on('user_typing', handleUserTyping);

    // Yeni mesaj dinleyicisi
    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('user_typing', handleUserTyping);
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, conversation?.id, user.id]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Eğer kullanıcı engellenmiş ise mesaj göndermeyi engelle
    if (isUserBlocked) {
      setBlockedMessage('Bu kullanıcıyı engellediniz. Mesaj gönderemezsiniz.');
      setShowBlockedWarning(true);
      return;
    }

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation.id,
          content: messageContent,
          receiverId: conversation.otherUser.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        const messageData = result.message;
        
        // Mesajı yerel olarak ekle
        setMessages(prev => [...prev, messageData]);
        if (onNewMessage) {
          onNewMessage(messageData);
        }
      } else if (response.status === 403) {
        // Engelleme hatası
        const errorData = await response.json();
        setBlockedMessage(errorData.error);
        setShowBlockedWarning(true);
        setNewMessage(messageContent); // Mesajı geri yükle
      }
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      // Hata durumunda mesaj inputunu geri yükle
      setNewMessage(messageContent);
    }
  };

  // Paket gönderme fonksiyonu
  const sendPackage = async (packageData) => {
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation.id,
          content: `📦 Paket paylaştı: ${packageData.title}`,
          receiverId: conversation.otherUser.id,
          messageType: 'PACKAGE',
          packageData: {
            id: packageData.id,
            title: packageData.title,
            description: packageData.description,
            price: packageData.price,
            duration: packageData.duration,
            features: packageData.features
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        const messageData = result.message;
        
        // Mesajı yerel olarak ekle
        setMessages(prev => [...prev, messageData]);
        if (onNewMessage) {
          onNewMessage(messageData);
        }
        
        // Modal'ı kapat
        setShowPackageModal(false);
      }
    } catch (error) {
      console.error('Paket gönderme hatası:', error);
    }
  };

  // Kullanıcı engelleme fonksiyonu
  const blockUser = async () => {
    try {
      setIsBlocking(true);
      const response = await fetch('/api/users/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockedUserId: conversation.otherUser.id
        })
      });

      if (response.ok) {
        setShowBlockConfirm(false);
        setShowMoreMenu(false);
        setIsUserBlocked(true);
        setBlockedMessage('Bu kullanıcıyı engellediniz. Artık birbirinize mesaj gönderemezsiniz.');
        setShowBlockedWarning(true);
        // Başarı mesajı göster veya konuşma listesine dön
        setTimeout(() => {
          if (onBack) {
            onBack();
          }
        }, 2000);
      } else {
        const errorData = await response.json();
        setBlockedMessage(errorData.error || 'Kullanıcı engellenemedi');
        setShowBlockedWarning(true);
        console.error('Kullanıcı engellenemedi');
      }
    } catch (error) {
      console.error('Engelleme hatası:', error);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (!socket) return;

    // Yazıyor durumunu başlat
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing_start', { 
        conversationId: conversation.id 
      });
    }

    // Yazıyor durumunu durdur (2 saniye sonra)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing_stop', { 
        conversationId: conversation.id 
      });
    }, 2000);
  };

  const formatMessageTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return 'şimdi';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} sa`;
      
      return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return '';
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Konuşma Seçin</h3>
          <p className="text-gray-400">Mesajlaşmaya başlamak için bir konuşma seçin</p>
        </div>
      </div>
    );
  }

  const isOtherUserOnline = onlineUsers.has(conversation.otherUser.id);
  

  return (
    <div className="flex-1 flex flex-col bg-gray-900 text-white min-h-0">
      {/* Chat Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="relative">
            <img
              src={conversation.otherUser.user_photo || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'}
              alt={conversation.otherUser.name}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                if (e.target.src !== 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50') {
                  e.target.src = 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50';
                }
              }}
            />
            {isOtherUserOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold">{conversation.otherUser.name}</h3>
            <p className="text-sm text-gray-400">
              {isUserBlocked ? (
                <span className="text-red-400 flex items-center space-x-1">
                  <UserX className="w-3 h-3" />
                  <span>Engellenmiş</span>
                </span>
              ) : (
                <>
                  {isOtherUserOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                  {otherUserTyping && ' • yazıyor...'}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link 
            href={`/profile/${conversation.otherUser.user_name}`}
            className="flex items-center space-x-1 px-2 sm:px-3 py-2 bg-primary-500 text-black hover:bg-primary-600 rounded-lg transition-colors"
            title="Profile Git"
          >
            <User className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Profil</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <div className="relative" ref={moreMenuRef}>
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {/* Dropdown Menu */}
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                {isUserBlocked ? (
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      // Engeli kaldırma fonksiyonu burada olacak
                      // TODO: Unblock API çağrısı eklenecek
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center space-x-3 text-green-400 hover:text-green-300 transition"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Engeli Kaldır</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowBlockConfirm(true);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center space-x-3 text-red-400 hover:text-red-300 transition"
                  >
                    <UserX className="w-4 h-4" />
                    <span className="text-sm">Kullanıcıyı Engelle</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p>Henüz mesaj yok</p>
              <p className="text-sm">İlk mesajı gönder!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isMyMessage = message.senderId === user.id;
              
              // Debug için package data kontrol et
              if (message.messageType === 'PACKAGE') {
                console.log('🔍 Paket mesajı debug:', {
                  messageType: message.messageType,
                  packageData: message.packageData,
                  packageDataType: typeof message.packageData,
                  content: message.content
                });
              }
              
              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMyMessage && (
                    <img 
                      src={
                        message.sender?.user_photo
                          ? message.sender.user_photo
                          : "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb"
                      } 
                      alt="" 
                      className="w-[50px] h-[50px] rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isMyMessage 
                      ? 'bg-primary-500 text-black' 
                      : 'bg-gray-700 text-white'
                  }`}>
                    {message.messageType === 'PACKAGE' && message.packageData ? (
                      // Paket mesajı görünümü
                      <div className="space-y-2 bg-black p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Package className="w-4 h-4 text-white" />
                          <span className="text-xs font-medium text-white opacity-80">Paket Paylaştı</span>
                        </div>
                        
                        <div className="p-3 rounded-lg border-2 border-primary-500 bg-black/20 backdrop-blur-sm">
                          <h4 className="font-medium text-sm mb-1 text-white">{message.packageData.title}</h4>
                          <p className="text-xs text-gray-300 mb-2 line-clamp-2">{message.packageData.description}</p>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-primary-500">
                              {message.packageData.price}₺
                            </span>
                            <span className="text-gray-400">
                              {message.packageData.duration} gün
                            </span>
                          </div>
                          
                          {message.packageData.features && message.packageData.features.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {message.packageData.features.slice(0, 2).map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs rounded bg-primary-500/20 text-primary-400 border border-primary-500/30"
                                >
                                  {feature}
                                </span>
                              ))}
                              {message.packageData.features.length > 2 && (
                                <span className="px-2 py-1 text-xs rounded bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                  +{message.packageData.features.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <Link
                            href={`/profile/${conversation.otherUser.user_name}?section=packages&package=${message.packageData.id}`}
                            className="block w-full mt-3 py-2 px-3 text-xs font-medium rounded-lg transition text-center bg-primary-500 hover:bg-primary-600 text-black"
                          >
                            Paketi İncele
                          </Link>
                        </div>
                      </div>
                    ) : (
                      // Normal mesaj görünümü
                      <>
                        <p className="text-sm">{message.content}</p>
                      </>
                    )}
                    
                    <p className={`text-xs mt-1 ${
                      isMyMessage ? 'text-black/70' : 'text-gray-400'
                    }`}>
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>
                  
                  {isMyMessage && (
                    <img 
                      src={
                        user?.user_photo
                          ? user.user_photo
                          : "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb"
                      } 
                      alt="" 
                      className="w-[50px] h-[50px] rounded-full object-cover flex-shrink-0"
                    />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-gray-800 border-t border-gray-700 p-4 flex-shrink-0">
        {isUserBlocked ? (
          // Engellenmiş kullanıcı için deaktif input
          <div className="flex items-center justify-center py-4">
            <div className="text-center text-gray-400">
              <UserX className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm">Bu kullanıcıyı engellediniz</p>
              <p className="text-xs">Mesaj gönderemezsiniz</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Mesajınızı yazın..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            
            {/* Paket paylaşma butonu - sadece PROVIDER'lar için */}
            {user?.role === 'PROVIDER' && (
              <button
                onClick={fetchUserPackages}
                disabled={isLoadingPackages}
                className={`p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
                  isLoadingPackages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Paket Paylaş"
              >
                {isLoadingPackages ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Package className="w-5 h-5" />
                )}
              </button>
            )}
            
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className={`p-2 rounded-lg transition ${
                newMessage.trim()
                  ? 'bg-primary-500 text-black hover:bg-primary-600'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Paket Paylaşma Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Paket Paylaş</h3>
              <button
                onClick={() => setShowPackageModal(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {userPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => sendPackage(pkg)}
                    className="p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                  >
                    <h4 className="font-medium text-white mb-1">{pkg.title}</h4>
                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">{pkg.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary-500 font-medium">
                        {pkg.price}₺
                      </span>
                      <span className="text-gray-400">
                        {pkg.duration} gün
                      </span>
                    </div>
                    {pkg.features && pkg.features.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {pkg.features.slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                          {pkg.features.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded">
                              +{pkg.features.length - 3} daha
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paket Uyarı Modal */}
      {showPackageWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-sm w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Paket Bulunamadı</h3>
              <button
                onClick={() => setShowPackageWarning(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h4 className="text-xl font-semibold text-white mb-2">Henüz Paket Yok</h4>
              <p className="text-gray-300 mb-6">
                Paket paylaşabilmek için öncelikle profilinizde paket yayınlamanız gerekiyor, bunun için panelinizden paketler kısmından paket yayınlayabilirsiniz.
              </p>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setShowPackageWarning(false)}
                  className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kullanıcı Engelleme Onay Modal */}
      {showBlockConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-sm w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Kullanıcıyı Engelle</h3>
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h4 className="text-xl font-semibold text-white mb-2">Emin misiniz?</h4>
              <p className="text-gray-300 mb-6">
                <span className="font-medium">{conversation.otherUser.name}</span> kullanıcısını engellemek istediğinize emin misiniz? 
                Bu kullanıcı size mesaj gönderemeyecek ve siz de ona mesaj gönderemeyeceksiniz.
              </p>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={blockUser}
                  disabled={isBlocking}
                  className={`w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center space-x-2 ${
                    isBlocking ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isBlocking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Engelleniyor...</span>
                    </>
                  ) : (
                    <>
                      <UserX className="w-4 h-4" />
                      <span>Kullanıcıyı Engelle</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowBlockConfirm(false)}
                  disabled={isBlocking}
                  className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engelleme Uyarı Modal */}
      {showBlockedWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-sm w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                {isUserBlocked ? 'Kullanıcı Engellendi' : 'Mesaj Gönderilemedi'}
              </h3>
              <button
                onClick={() => {
                  setShowBlockedWarning(false);
                  setIsUserBlocked(false);
                }}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 text-center">
              <UserX className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h4 className="text-xl font-semibold text-white mb-2">
                {isUserBlocked ? 'Engelleme Başarılı' : 'Ulaşılamıyor'}
              </h4>
              <p className="text-gray-300 mb-6">
                {blockedMessage}
              </p>
              
              <button
                onClick={() => {
                  setShowBlockedWarning(false);
                  if (isUserBlocked && onBack) {
                    onBack();
                  }
                }}
                className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition"
              >
                {isUserBlocked ? 'Konuşma Listesine Dön' : 'Tamam'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
