"use client";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthContext } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (user && !socket) {
      console.log('🔌 Kullanıcı bağlanıyor:', user.name);
      
      const socketUrl = process.env.NODE_ENV === 'production' 
        ? (process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin)
        : 'http://localhost:3000';
        
      console.log('🌐 Socket URL:', socketUrl);
        
      const newSocket = io(socketUrl, {
        auth: {
          userId: user.id,
          userName: user.name
        },
        transports: ['websocket', 'polling'],
        upgrade: true,
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        randomizationFactor: 0.5,
        forceNew: false,
        // Production için ek ayarlar
        ...(process.env.NODE_ENV === 'production' ? {
          secure: true,
          rejectUnauthorized: false
        } : {})
      });

      // Bağlantı olayları
      newSocket.on('connect', () => {
        console.log('✅ Socket başarıyla bağlandı:', newSocket.id, 'Transport:', newSocket.io.engine.transport.name);
        setIsConnected(true);
        setReconnectAttempts(0);
        
        // Transport upgrade'i dinle
        newSocket.io.engine.on('upgrade', () => {
          console.log('🔄 Transport upgraded to:', newSocket.io.engine.transport.name);
        });
        
        // Kullanıcıyı online olarak işaretle
        newSocket.emit('user_online', user.id);
        
        // Heartbeat gönder
        const heartbeat = setInterval(() => {
          if (newSocket.connected) {
            newSocket.emit('ping');
          } else {
            clearInterval(heartbeat);
          }
        }, 25000);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ Socket bağlantısı kesildi:', reason);
        setIsConnected(false);
        
        // Sadece beklenmeyen bağlantı kesintilerinde yeniden bağlan
        if (reason === 'io server disconnect' || reason === 'io client disconnect') {
          console.log('🔄 Manuel disconnect, yeniden bağlanma yok');
          return;
        }
        
        if (reconnectAttempts < maxReconnectAttempts) {
          console.log(`🔄 Yeniden bağlanma denemesi ${reconnectAttempts + 1}/${maxReconnectAttempts}`);
          setReconnectAttempts(prev => prev + 1);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket bağlantı hatası:', error.message);
        setIsConnected(false);
        
        if (reconnectAttempts >= maxReconnectAttempts) {
          console.log('❌ Maksimum yeniden bağlanma denemesi aşıldı');
        }
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('✅ Socket yeniden bağlandı, deneme:', attemptNumber);
        setIsConnected(true);
        setReconnectAttempts(0);
      });

      newSocket.on('reconnect_error', (error) => {
        console.error('❌ Yeniden bağlanma hatası:', error.message);
      });

      newSocket.on('reconnect_failed', () => {
        console.error('❌ Yeniden bağlanma başarısız');
        setIsConnected(false);
      });

      // Online kullanıcıları dinle - Event adını düzelt
      newSocket.on('users_online', (userIds) => {
        console.log('👥 Online kullanıcılar güncellendi:', userIds);
        setOnlineUsers(new Set(userIds));
      });

      newSocket.on('user_connected', (userId) => {
        console.log('👤 Kullanıcı bağlandı:', userId);
        setOnlineUsers(prev => {
          const newSet = new Set([...prev, userId]);
          console.log('👥 Güncel online kullanıcılar:', Array.from(newSet));
          return newSet;
        });
      });

      newSocket.on('user_disconnected', (userId) => {
        console.log('👤 Kullanıcı ayrıldı:', userId);
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          console.log('👥 Güncel online kullanıcılar:', Array.from(newSet));
          return newSet;
        });
      });
      
      // Pong response
      newSocket.on('pong', () => {
        console.log('🏓 Pong alındı');
      });

      setSocket(newSocket);
    }

    return () => {
      if (socket) {
        console.log('🔌 Socket temizleniyor...');
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setReconnectAttempts(0);
      }
    };
  }, [user, reconnectAttempts]);

  const joinConversation = (conversationId) => {
    if (socket && isConnected) {
      socket.emit('join_conversation', conversationId);
      console.log('💬 Konuşmaya katılındı:', conversationId);
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    joinConversation
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
