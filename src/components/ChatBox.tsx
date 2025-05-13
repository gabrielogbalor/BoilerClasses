"use client";

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import io, { Socket } from 'socket.io-client';

interface Message {
  room: string;
  name: string;
  text: string;
  timestamp: string;
}

export default function ChatBox({ courseCode }: { courseCode: string }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    // Socket event handlers
    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('joinRoom', courseCode);
    });

    newSocket.on('previousMessages', (previousMessages: Message[]) => {
      setMessages(previousMessages);
    });

    newSocket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [courseCode]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !text.trim() || !session?.user?.name) return;

    socket.emit('message', {
      room: courseCode,
      name: session.user.name,
      text: text.trim()
    });

    setText('');
  };

  if (!session) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md mt-8">
        <h2 className="text-xl font-semibold mb-4">Course Chat</h2>
        <p className="text-gray-600 text-center py-4">
          Please sign in to join the chat.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Course Chat</h2>
        <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      {/* Messages container */}
      <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${
              msg.name === session?.user?.name
                ? 'ml-auto bg-purple-100'
                : 'mr-auto bg-gray-100'
            } max-w-[80%] rounded-lg p-3`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{msg.name}</span>
              <span className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-700">{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input form */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={!isConnected}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
