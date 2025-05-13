import { createServer } from 'http';
import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-production-domain.com' 
      : 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

interface ChatMessage {
  room: string;
  name: string;
  text: string;
  timestamp: string;
}

const messages: Record<string, ChatMessage[]> = {};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinRoom', (room: string) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
    
    // Send existing messages to the client
    if (messages[room]) {
      socket.emit('previousMessages', messages[room]);
    }
  });

  socket.on('message', (data: Omit<ChatMessage, 'timestamp'>) => {
    const message = {
      ...data,
      timestamp: new Date().toISOString()
    };

    // Store the message
    if (!messages[data.room]) {
      messages[data.room] = [];
    }
    messages[data.room].push(message);

    // Keep only last 100 messages
    if (messages[data.room].length > 100) {
      messages[data.room] = messages[data.room].slice(-100);
    }

    // Broadcast to all clients in the room
    io.to(data.room).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const port = 4000;
httpServer.listen(port, () => {
  console.log(`Chat server running on port ${port}`);
});
