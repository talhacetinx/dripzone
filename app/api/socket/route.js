import { NextRequest, NextResponse } from 'next/server';

// Global variables for Socket.io
let io;
let httpServer;
const onlineUsers = new Map();

// Initialize Socket.io server
const initSocketServer = async () => {
  if (!io) {
    console.log('🔌 Socket.io sunucusu başlatılıyor...');
    
    // Import Socket.io server dynamically
    const { Server } = await import('socket.io');
    
    // Use the current Next.js server instead of creating a new one
    io = new Server({
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? ['https://dripzone-topaz.vercel.app']
          : ['http://localhost:3000', 'http://localhost:3001'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      allowEIO3: true
    });

    // Socket.io event handlers
    io.on('connection', (socket) => {
      console.log('🔌 New user connected:', socket.id);

      // User comes online
      socket.on('user_online', (userId) => {
        console.log('👤 User online:', userId);
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;
        
        // Broadcast to other users
        socket.broadcast.emit('user_connected', userId);
        io.emit('users_online', Array.from(onlineUsers.keys()));
      });

      // Join conversation room
      socket.on('join_conversation', (conversationId) => {
        console.log('💬 Joined conversation:', conversationId);
        socket.join(conversationId);
      });

      // Leave conversation room
      socket.on('leave_conversation', (conversationId) => {
        console.log('🚪 Left conversation:', conversationId);
        socket.leave(conversationId);
      });

      // Send message
      socket.on('send_message', async (data) => {
        try {
          const { conversationId, senderId, content, receiverId } = data;
          
          console.log('📤 Sending message:', { conversationId, senderId, content });

          // Import Prisma dynamically to avoid build issues
          const prisma = (await import('../lib/prisma')).default;

          // Save message to database
          const message = await prisma.message.create({
            data: {
              conversationId,
              senderId,
              content,
              messageType: 'TEXT'
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  user_photo: true
                }
              }
            }
          });

          // Update conversation
          await prisma.conversation.update({
            where: { id: conversationId },
            data: {
              lastMessage: content,
              lastMessageAt: new Date(),
              updatedAt: new Date()
            }
          });

          // Emit message to conversation room
          io.to(conversationId).emit('new_message', message);

          // Send notification to receiver if online
          const receiverSocketId = onlineUsers.get(receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit('message_notification', {
              message,
              conversationId,
              sender: message.sender
            });
          }

          console.log('✅ Message sent:', message.id);

        } catch (error) {
          console.error('❌ Message sending error:', error);
          socket.emit('message_error', { error: 'Message could not be sent' });
        }
      });

      // Typing indicators
      socket.on('typing_start', (data) => {
        const { conversationId } = data;
        socket.to(conversationId).emit('user_typing', {
          userId: socket.userId,
          conversationId,
          isTyping: true
        });
      });

      socket.on('typing_stop', (data) => {
        const { conversationId } = data;
        socket.to(conversationId).emit('user_typing', {
          userId: socket.userId,
          conversationId,
          isTyping: false
        });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('🔌 User disconnected:', socket.id);
        
        if (socket.userId) {
          onlineUsers.delete(socket.userId);
          socket.broadcast.emit('user_disconnected', socket.userId);
          io.emit('users_online', Array.from(onlineUsers.keys()));
        }
      });
    });

    // Start HTTP server for Socket.io
    const port = process.env.SOCKET_PORT || 3002;
    httpServer.listen(port, () => {
      console.log(`✅ Socket.io server listening on port ${port}`);
    });
  }

  return io;
};

// GET endpoint - Socket.io status
export async function GET() {
  if (!io) {
    await initSocketServer();
  }
  
  return NextResponse.json({ 
    status: 'Socket.io server running',
    onlineUsers: Array.from(onlineUsers.keys()),
    port: process.env.SOCKET_PORT || 3002
  });
}

// POST endpoint for manual initialization
export async function POST() {
  try {
    await initSocketServer();
    return NextResponse.json({ status: 'Socket.io server initialized' });
  } catch (error) {
    console.error('Socket.io initialization error:', error);
    return NextResponse.json({ error: 'Failed to initialize Socket.io' }, { status: 500 });
  }
}

export { io };
