import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0';
const port = process.env.PORT || 3000;

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

  const io = new Server(server, {
    cors: {
      origin: dev
        ? ['http://localhost:3000', 'http://localhost:3001']
        : [process.env.PROD_URL, 'https://dripzonemusic.com'].filter(Boolean),
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  global.io = io;

  io.on('connection', (socket) => {
    console.log('✅ Yeni kullanıcı bağlandı:', socket.id);

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

      socket.emit('message_sent', { success: true });
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('users_online', Array.from(onlineUsers.keys()));
      }
    });
  });

  server.listen(port, hostname, () => {
    console.log(`🚀 Server ready at http://${hostname}:${port}`);
  });
});