require('dotenv').config();

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0';
const port = process.env.PORT || 3000; // Plesk panelden değiştirebilirsin

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

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
        : [process.env.PROD_URL].filter(Boolean), // Artık sadece PROD_URL
      methods: ['GET', 'POST'],
      credentials: true,
      allowEIO3: true
    },
    transports: dev ? ['websocket', 'polling'] : ['polling', 'websocket'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  global.socketIO = io;

  io.on('connection', (socket) => {
    console.log('✅ Yeni kullanıcı bağlandı:', socket.id, 'Transport:', socket.conn.transport.name);

    socket.on('user_online', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;

      socket.broadcast.emit('user_connected', userId);
      io.emit('users_online', Array.from(onlineUsers.keys()));
    });

    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('send_message', (data) => {
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
        io.to(onlineUsers.get(data.receiverId)).emit('new_message', messageData);
      }

      socket.emit('message_sent', { success: true, messageId: data.id });
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

    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        socket.broadcast.emit('user_disconnected', socket.userId);
        io.emit('users_online', Array.from(onlineUsers.keys()));
      }
    });
  });

  server.listen(port, () => {
    console.log(`🚀 Sunucu hazır: http://${hostname}:${port}`);
    console.log('🔌 Socket.io etkin');
  });
});