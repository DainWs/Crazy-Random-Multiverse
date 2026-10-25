import { beforeEach, describe, expect, it, vi } from 'vitest';
import { register, login, getAccount, updateAccount, createParty, joinParty, getPartyList } from '@/api/UserApi';
import User from '@/domain/User';
import Party from '@/domain/Party';

describe('UserApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('register creates user from POST response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      json: async () => ({ id: 'usr-1', username: 'PlayerOne' })
    } as Response);

    const user = await register();

    expect(fetch).toHaveBeenCalledWith('/register', { method: 'POST' });
    expect(user).toBeInstanceOf(User);
    expect(user.code).toBe('usr-1');
    expect(user.name).toBe('PlayerOne');
  });

  it('login sends username and returns User', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      json: async () => ({ id: 'usr-2', username: 'Gamer' })
    } as Response);

    const user = await login('Gamer');

    expect(fetch).toHaveBeenCalledWith('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'Gamer',
    });
    expect(user.code).toBe('usr-2');
    expect(user.name).toBe('Gamer');
  });

  it('getAccount fetches user profile', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      json: async () => ({ id: 'usr-3', username: 'Existing' })
    } as Response);

    const user = await getAccount();

    expect(fetch).toHaveBeenCalledWith('/user');
    expect(user.code).toBe('usr-3');
  });

  it('updateAccount sends PUT request with UserDto', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({} as Response);
    const user = new User('usr-4', 'UpdatedName');

    await updateAccount(user);

    expect(fetchSpy).toHaveBeenCalledWith('/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'usr-4', username: 'UpdatedName' }),
    });
  });

  it('createParty creates and returns a Party', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      json: async () => ({
        code: 'party-1',
        name: 'My Party',
        gameMode: 'CLASSIC',
        userCount: 1,
        maxUsers: 4,
        owner: 'usr-1',
        users: ['usr-1'],
      })
    } as Response);

    const party = await createParty();

    expect(party).toBeInstanceOf(Party);
    expect(party.code).toBe('party-1');
    expect(party.users).toEqual(['usr-1']);
  });

  it('joinParty encodes party code and returns Party', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      json: async () => ({
        code: 'party+123',
        name: 'Joined Party',
        gameMode: 'CLASSIC',
        userCount: 2,
        maxUsers: 4,
        owner: 'usr-1',
        users: ['usr-1', 'usr-2'],
      })
    } as Response);

    const party = await joinParty('party+123');

    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/party\/.*\/join/), { method: 'POST' });
    expect(party.code).toBe('party+123');
  });

  it('getPartyList maps parties list to minimal party entities', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      json: async () => ({
        parties: [
          {
            code: 'p1',
            name: 'Party 1',
            gameMode: 'CLASSIC',
            userCount: 2,
            maxUsers: 4,
            owner: 'usr-1',
            users: ['usr-1', 'usr-2'],
          }
        ]
      })
    } as Response);

    const parties = await getPartyList();

    expect(fetch).toHaveBeenCalledWith('/party/list');
    expect(parties).toHaveLength(1);
    expect(parties[0].code).toBe('p1');
    expect(parties[0].users).toHaveLength(0); // toMinimalParty does not populate users list
  });
});
