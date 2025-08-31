"use client";
import { useState } from 'react';
import { Search, MessageCircle, Plus, User } from 'lucide-react';

export default function ConversationsList({ 
  conversations, 
  selectedConversation, 
  onConversationSelect, 
  isLoading,
  onNewConversation
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  
  // Debug için console.log ekleyelim
  console.log('ConversationsList - conversations:', conversations);
  console.log('ConversationsList - isLoading:', isLoading);
  
  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } else if (diffInHours < 168) { // 7 gün
        return date.toLocaleDateString('tr-TR', { weekday: 'short' });
      } else {
        return date.toLocaleDateString('tr-TR', { 
          day: '2-digit', 
          month: '2-digit' 
        });
      }
    } catch (error) {
      return '';
    }
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return 'Henüz mesaj yok';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  // Kullanıcı arama fonksiyonu
  const searchUsers = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(`/api/messages/search-users?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error('Kullanıcı arama hatası:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Yeni konuşma başlat
  const startNewConversation = async (userId) => {
    try {
      const response = await fetch('/api/messages/create-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUserId: userId })
      });

      if (response.ok) {
        const data = await response.json();
        onNewConversation(data.conversation);
        setShowNewChat(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Konuşma oluşturma hatası:', error);
    }
  };

  // Arama input değişikliği
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-400">Konuşmalar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Mesajlar</h2>
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            className="p-2 bg-primary-500 text-black rounded-lg hover:bg-primary-600 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={showNewChat ? "Kullanıcı ara..." : "Konuşmalarda ara..."}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400 text-sm"
          />
        </div>
      </div>

      {/* New Chat - Search Results */}
      {showNewChat && searchQuery && (
        <div className="border-b border-gray-800">
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-48 overflow-y-auto">
              {searchResults.map(user => (
                <button
                  key={user.id}
                  onClick={() => startNewConversation(user.id)}
                  className="w-full p-3 flex items-center space-x-3 hover:bg-gray-800 transition"
                >
                  <img
                    src={user.user_photo || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">@{user.user_name}</p>
                  </div>
                  <User className="w-4 h-4 text-gray-500" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              Kullanıcı bulunamadı
            </div>
          )}
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">{/* Geri kalanı aynı kalacak */}
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Henüz mesajınız yok</h3>
            <p className="text-sm text-gray-400">
              Yeni konuşma başlatmak için profil sayfalarındaki mesaj butonunu kullanın
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation)}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-800 ${
                  selectedConversation?.id === conversation.id 
                    ? 'bg-gray-800 border-r-4 border-primary-500' 
                    : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={conversation.otherUser.user_photo || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'}
                      alt={conversation.otherUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        if (e.target.src !== 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50') {
                          e.target.src = 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50';
                        }
                      }}
                    />
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-primary-500 text-black text-xs rounded-full min-w-[18px] h-4 flex items-center justify-center font-medium">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium truncate ${
                          conversation.unreadCount > 0 ? 'text-white' : 'text-gray-300'
                        }`}>
                          {conversation.otherUser.name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          @{conversation.otherUser.user_name}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    
                    <p className={`text-xs truncate ${
                      conversation.unreadCount > 0 
                        ? 'text-gray-300 font-medium' 
                        : 'text-gray-500'
                    }`}>
                      {truncateMessage(conversation.lastMessage)}
                    </p>

                    {/* User Role */}
                    <div className="mt-1">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-800 text-primary-500 rounded-full border border-gray-700">
                        {conversation.otherUser.role === 'PROVIDER' ? 'Sağlayıcı' : 
                         conversation.otherUser.role === 'ARTIST' ? 'Sanatçı' : 'Kullanıcı'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
