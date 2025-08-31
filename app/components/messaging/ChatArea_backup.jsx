"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, ArrowLeft, Phone, Video, MoreVertical, Smile } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

export default function ChatArea({ conversation, onNewMessage, onBack, isMobile = false }) {
  const { user } = useAuthContext();
  const { socket, onlineUsers, joinConversation } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

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
      }
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      // Hata durumunda mesaj inputunu geri yükle
      setNewMessage(messageContent);
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
    <div className="flex-1 flex flex-col bg-gray-900 text-white">
      {/* Chat Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
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
              src={conversation.otherUser.user_photo || '/default-avatar.png'}
              alt={conversation.otherUser.name}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            {isOtherUserOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold">{conversation.otherUser.name}</h3>
            <p className="text-sm text-gray-400">
              {isOtherUserOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
              {otherUserTyping && ' • yazıyor...'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-700 rounded-lg">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          messages.map((message) => {
            const isMyMessage = message.senderId === user.id;
            return (
              <div
                key={message.id}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isMyMessage 
                    ? 'bg-primary-500 text-black' 
                    : 'bg-gray-700 text-white'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isMyMessage ? 'text-black/70' : 'text-gray-400'
                  }`}>
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-700 rounded-lg">
            <Smile className="w-5 h-5 text-gray-400" />
          </button>
          
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
      </div>
    </div>
  );
}
