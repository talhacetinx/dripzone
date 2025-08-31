const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Socket.io helper import (dynamic import for ES module)
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
        : ['https://dripzone-topaz.vercel.app'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Socket.io instance'ını global olarak erişilebilir yap
  global.socketIO = io;

  io.on('connection', (socket) => {
    console.log('✅ Yeni kullanıcı bağlandı:', socket.id);

    // User comes online
    socket.on('user_online', (userId) => {
      console.log('👤 Kullanıcı online:', userId);
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      
      // Broadcast to other users
      socket.broadcast.emit('user_connected', userId);
      io.emit('users_online', Array.from(onlineUsers.keys()));
    });

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      console.log('💬 Konuşmaya katıldı:', conversationId);
      socket.join(conversationId);
    });

    // Send message
    socket.on('send_message', async (data) => {
      console.log('📨 Mesaj gönderiliyor:', data);
      try {
        // Emit to conversation room
        socket.to(data.conversationId).emit('new_message', {
          id: data.id || Date.now(),
          content: data.content,
          senderId: data.senderId,
          conversationId: data.conversationId,
          createdAt: new Date(),
          sender: data.sender
        });
        
        // Confirm to sender
        socket.emit('message_sent', { success: true, messageId: data.id });
      } catch (error) {
        console.error('Mesaj gönderme hatası:', error);
        socket.emit('message_sent', { success: false, error: error.message });
      }
    });

    // Typing indicators
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

    // Disconnect
    socket.on('disconnect', (reason) => {
      console.log('❌ Kullanıcı ayrıldı:', socket.id, 'Sebep:', reason);
      
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        socket.broadcast.emit('user_disconnected', socket.userId);
        io.emit('users_online', Array.from(onlineUsers.keys()));
      }
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
