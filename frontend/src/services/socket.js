import { io } from 'socket.io-client';
import { loadStoredAuth } from '../utils/auth';

const normalizeSocketUrl = (baseUrl) => {
  if (!baseUrl) {
    return undefined;
  }

  try {
    const parsed = new URL(baseUrl);
    return parsed.origin;
  } catch {
    return baseUrl;
  }
};

export const createSocketConnection = () => {
  const storedAuth = loadStoredAuth();

  if (!storedAuth?.token) {
    return null;
  }

  return io(normalizeSocketUrl(import.meta.env.VITE_API_BASE_URL), {
    auth: {
      token: storedAuth.token
    },
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 10000
  });
};
