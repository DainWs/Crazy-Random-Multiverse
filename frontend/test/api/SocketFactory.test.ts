import { describe, expect, it, vi } from 'vitest';
import { io } from 'socket.io-client';
import { createIOSocket } from '@/api/models/SocketFactory';

vi.mock('socket.io-client', () => ({ io: vi.fn(() => ({})) }));

describe('SocketFactory', () => {
  it('opens the connection sending the session cookie', () => {
    createIOSocket({ url: 'http://localhost:9092' });

    expect(io).toHaveBeenCalledWith('http://localhost:9092', expect.objectContaining({ withCredentials: true }));
  });
});
