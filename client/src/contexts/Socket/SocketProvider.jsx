// src/contexts/SocketProvider.jsx
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SocketContext } from './SocketContext.jsx';

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    // Create socket once
    socketRef.current = io(backendUrl, {
      autoConnect: false,
      transports: ['websocket'],
      withCredentials: true,
    });

    const sock = socketRef.current;

    const handleConnect = () => {
      console.log('✅ Connected to server:', sock.id);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    };

    sock.on('connect', handleConnect);
    sock.on('disconnect', handleDisconnect);

    sock.connect();
    setSocket(sock);

    return () => {
      sock.off('connect', handleConnect);
      sock.off('disconnect', handleDisconnect);
      sock.disconnect();
      console.log('🔌 Socket connection closed.');
    };
  }, [backendUrl]);

  // --- Helper functions ---
  const joinRoom = (room) => {
    if (!socket) return;
    socket.emit('join_room', room);
    console.log(`✅ Joined room: ${room}`);
  };

  const sendMessage = (room, message) => {
    if (!socket || !message.trim()) return;
    socket.emit('send_message', { room, message });
    console.log(`📤 Message sent to ${room}:`, message);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinRoom,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
