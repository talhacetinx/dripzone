"use client";
import { useState, useEffect } from 'react';
import { Search, X, User, MessageCircle } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

export default function MessagePopup({ onClose, onStartChat, conversations, setConversations }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('conversations'); // 'conversations' | 'search'
  const { socket, onlineUsers } = useSocket();

  // Konuşmaları getir
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Konuşmalar getirilemedi:', error);
    }
  };

  // Kullanıcı arama
  const searchUsers = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(term)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error('Kullanıcı arama hatası:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab === 'search') {
        searchUsers(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, activeTab]);

  const startChatWithUser = (user) => {
    onStartChat(user);
    onClose(); // Popup'ı kapat
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('tr-TR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Mesajlar</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('conversations')}
          className={`flex-1 py-2 px-4 text-sm font-medium transition ${
            activeTab === 'conversations'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sohbetler
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-2 px-4 text-sm font-medium transition ${
            activeTab === 'search'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Yeni Mesaj
        </button>
      </div>

      {/* Search Bar (Sadece search tab'ında) */}
      {activeTab === 'search' && (
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kullanıcı ara..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'conversations' ? (
          // Mevcut Konuşmalar
          <div className="p-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Henüz mesajınız yok</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => startChatWithUser(conversation.otherUser)}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                >
                  <div className="relative">
                    <img
                      src={conversation.otherUser.user_photo || '/default-avatar.png'}
                      alt={conversation.otherUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {onlineUsers.has(conversation.otherUser.id) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.otherUser.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessageAt && formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.lastMessage || 'Henüz mesaj yok'}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="ml-2 bg-primary-500 text-black text-xs rounded-full min-w-[18px] h-4 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          // Kullanıcı Arama Sonuçları
          <div className="p-2">
            {isSearching ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-sm mt-2">Aranıyor...</p>
              </div>
            ) : searchResults.length === 0 && searchTerm ? (
              <div className="text-center py-8 text-gray-500">
                <User size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Kullanıcı bulunamadı</p>
              </div>
            ) : (
              searchResults.map((user) => (
                <div
                  key={user.id}
                  onClick={() => startChatWithUser(user)}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                >
                  <div className="relative">
                    <img
                      src={user.user_photo || '/default-avatar.png'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {onlineUsers.has(user.id) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{user.user_name} • {user.role}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
