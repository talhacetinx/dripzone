"use client";
import { useState, useEffect, useRef } from 'react';
import { Send, X, Minimize2, Maximize2, Smile } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useAuthContext } from '../../context/AuthContext';

export default function ChatInterface({ chat, onClose, onMinimize, onUpdateMessages, style }) {
  const { user } = useAuthContext();
  const { socket, onlineUsers } = useSocket();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  // Socket dinleyicileri
  useEffect(() => {
    if (!socket || !chat.conversationId) return;

    // Yazıyor durumu dinleyicisi
    socket.on('user_typing', (data) => {
      if (data.userId !== user.id && data.conversationId === chat.conversationId) {
        setOtherUserTyping(data.isTyping);
      }
    });

    // Yeni mesaj dinleyicisi (sadece başkalarından gelen mesajları ekle)
    socket.on('new_message', (messageData) => {
      if (messageData.conversationId === chat.conversationId && messageData.senderId !== user.id) {
        onUpdateMessages(messageData);
      }
    });

    return () => {
      socket.off('user_typing');
      socket.off('new_message');
    };
  }, [socket, chat.conversationId, user.id, onUpdateMessages]);

  // Mesaj gönderme
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      // HTTP API ile mesaj gönder
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: chat.conversationId,
          content: messageContent,
          receiverId: chat.otherUser.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        const messageData = result.message;
        
        // Socket.io ile sadece diğer kullanıcıya bildir
        if (socket) {
          socket.emit('send_message', {
            ...messageData,
            conversationId: chat.conversationId,
            receiverId: chat.otherUser.id
          });
        }
        
        // Mesajı sadece kendi tarafımızda yerel olarak ekle
        onUpdateMessages(messageData);
      }

    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
    }
  };

  // Enter tuşu ile mesaj gönderme
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Yazıyor durumu yönetimi
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (!socket) return;

    // Yazıyor durumunu başlat
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing_start', { 
        conversationId: chat.conversationId 
      });
    }

    // Yazıyor durumunu durdur (2 saniye sonra)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing_stop', { 
        conversationId: chat.conversationId 
      });
    }, 2000);
  };

  // Mesaj zamanı formatla
  const formatMessageTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      console.error('Tarih formatlama hatası:', error);
      return '';
    }
  };

  const isOnline = onlineUsers.has(chat.otherUser.id);

  return (
    <div 
      className={`fixed bottom-6 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-40 flex flex-col ${
        chat.isMinimized ? 'h-12' : 'h-96'
      }`}
      style={style}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={chat.otherUser.user_photo || '/default-avatar.png'}
              alt={chat.otherUser.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              {chat.otherUser.name}
            </h4>
            <p className="text-xs text-gray-500">
              {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={onMinimize}
            className="p-1 text-gray-400 hover:text-gray-600 transition"
          >
            {chat.isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Chat Content  */}
      {!chat.isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {chat.messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">Henüz mesaj yok</p>
                <p className="text-xs">İlk mesajı gönderin!</p>
              </div>
            ) : (
              chat.messages.map((message, index) => {
                // Her mesajın mutlaka benzersiz bir key'i olsun
                const messageKey = message.id || `temp-${Date.now()}-${index}`;
                
                return (
                  <div
                    key={messageKey}
                    className={`flex ${
                      message.senderId === user.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                        message.senderId === user.id
                          ? 'bg-primary-500 text-black rounded-br-none'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === user.id 
                          ? 'text-gray-700' 
                          : 'text-gray-500'
                      }`}>
                        {formatMessageTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            
            {/* Yazıyor göstergesi */}
            {otherUserTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Mesajınızı yazın..."
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="1"
                  style={{ minHeight: '36px', maxHeight: '80px' }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="p-2 bg-primary-500 text-black rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
