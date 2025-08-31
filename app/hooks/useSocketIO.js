import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

let socket = null;

export const useSocketIO = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');

  useEffect(() => {
    if (typeof window !== 'undefined' && !socket) {
      // Socket.io bağlantısını oluştur
      const socketPort = process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_SOCKET_URL 
        : 'http://localhost:3002';
        
      socket = io(socketPort, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        retries: 3
      });

      socket.on('connect', () => {
        console.log('🔌 Socket.io connected');
        setIsConnected(true);
        setTransport(socket.io.engine.transport.name);

        socket.io.engine.on('upgrade', () => {
          setTransport(socket.io.engine.transport.name);
        });
      });

      socket.on('disconnect', () => {
        console.log('🔌 Socket.io disconnected');
        setIsConnected(false);
        setTransport('N/A');
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  return {
    socket,
    isConnected,
    transport
  };
};
