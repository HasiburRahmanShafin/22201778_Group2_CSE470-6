import io from 'socket.io-client';

let socket;

export const connectSocket = (userId) => {
  socket = io('http://localhost:5000', {
    query: { userId },
    transports: ['websocket']
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const getSocket = () => socket;