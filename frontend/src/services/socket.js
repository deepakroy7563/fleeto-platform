import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = (userId, role) => {
  socket.connect();
  
  socket.on('connect', () => {
    console.log('Connected to socket server');
    socket.emit('join', userId);
    
    if (role === 'admin') {
      socket.emit('join_admin');
    }
  });
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
