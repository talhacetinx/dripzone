require('dotenv').config();

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

let setSocketIO = null;

const onlineUsers = new Map();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Socket.io setup
  const io = new Server(server, {
    cors: {
      origin: dev 
        ? ['http://localhost:3000', 'http://localhost:3001']
        : [
            process.env.PROD_URL,
            'https://dripzone-topaz.vercel.app',
            'https://*.vercel.app',
            process.env.NEXT_PUBLIC_SITE_URL,
            process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
          ].filter(Boolean),
      methods: ['GET', 'POST'],
      credentials: true,
      allowEIO3: true
    },
    transports: dev ? ['websocket', 'polling'] : ['polling', 'websocket'],
    pingTimeout: 60000,
    pingInterval: 25000,
    allowEIO3: true,
    ...(dev ? {} : {
      cookie: false,
      serveClient: false,
      upgrade: false, // Vercel için upgrade'i kapat
      rememberUpgrade: false,
      allowUpgrades: false // Vercel WebSocket upgrade'ini engelle
    })
  });

  global.socketIO = io;

  io.on('connection', (socket) => {
    console.log('✅ Yeni kullanıcı bağlandı:', socket.id, 'Transport:', socket.conn.transport.name);
    
    socket.conn.on('upgrade', () => {
      console.log('🔄 Transport upgraded to:', socket.conn.transport.name);
    });

    socket.on('user_online', (userId) => {
      console.log('👤 Kullanıcı online:', userId, 'Socket:', socket.id);
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      
      socket.broadcast.emit('user_connected', userId);
      
      const onlineUsersList = Array.from(onlineUsers.keys());
      io.emit('users_online', onlineUsersList);
      console.log('📊 Online kullanıcılar:', onlineUsersList);
    });

    socket.on('join_conversation', (conversationId) => {
      console.log('💬 Konuşmaya katıldı:', conversationId);
      socket.join(conversationId);
    });

    socket.on('send_message', async (data) => {
      console.log('📨 Mesaj gönderiliyor:', data.conversationId, 'Sender:', data.senderId);
      try {
        const messageData = {
          id: data.id || Date.now(),
          content: data.content,
          senderId: data.senderId,
          conversationId: data.conversationId,
          createdAt: new Date(),
          sender: data.sender
        };
        
        socket.to(data.conversationId).emit('new_message', messageData);
        
        if (data.receiverId && onlineUsers.has(data.receiverId)) {
          const receiverSocketId = onlineUsers.get(data.receiverId);
          io.to(receiverSocketId).emit('new_message', messageData);
        }
        
        socket.emit('message_sent', { success: true, messageId: data.id });
        console.log('✅ Mesaj başarıyla gönderildi');
      } catch (error) {
        console.error('❌ Mesaj gönderme hatası:', error);
        socket.emit('message_sent', { success: false, error: error.message });
      }
    });

    socket.on('typing_start', (data) => {
      socket.to(data.conversationId).emit('user_typing', {
        userId: data.userId,
        conversationId: data.conversationId
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(data.conversationId).emit('user_stop_typing', {
        userId: data.userId,
        conversationId: data.conversationId
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Kullanıcı ayrıldı:', socket.id, 'Sebep:', reason, 'UserId:', socket.userId);
      
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        socket.broadcast.emit('user_disconnected', socket.userId);
        
        const onlineUsersList = Array.from(onlineUsers.keys());
        io.emit('users_online', onlineUsersList);
        console.log('📊 Güncel online kullanıcılar:', onlineUsersList);
      }
    });
    
    socket.on('connect_error', (error) => {
      console.error('🔥 Socket bağlantı hatası:', error);
    });
    
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  server
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`🚀 Sunucu hazır: http://${hostname}:${port}`);
      console.log('🔌 Socket.io etkin');
    });
});
