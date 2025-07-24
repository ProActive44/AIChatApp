import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export function getSocket(token) {
  return io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    path: '/socket.io',
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 20000,
  });
}
