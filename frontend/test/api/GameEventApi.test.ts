import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameEventListener } from '@/api/models/Listeners';
import type { EventDto } from '@/api/dtos/EventDto';
import type { GameEventCode } from '@/api/models/GameEventCode';
import { onGameLoading, onGameSync } from '@/api/GameEventApi';
import { CardCode } from '@/domain/Card';
import socketEventHandler from '@/api/SocketEventHandler';

function createEvent(code: GameEventCode): EventDto {
    return {
        code,
        details: {
            game: {
                code: 'game-1',
                zones: [
                    {
                        owner: { code: 'p1', name: 'One', isSpectator: false, isAlive: true, handSize: 0 },
                        type: 'BASE',
                        combatants: [
                            [
                                {
                                    allowedCombatant: 'LEADER',
                                    combatant: { catalogCode: { code: '0', type: 'LEADER' }, name: '0', description: '', type: 'LEADER' }
                                }
                            ]
                        ]
                    }
                ]
            }
        }
    } as EventDto;
}

describe('GameEventApi', () => {
    let registered: Map<string, GameEventListener>;

    beforeEach(() => {
        vi.restoreAllMocks();
        registered = new Map();
        vi.spyOn(socketEventHandler, 'onGameEvent').mockImplementation((code, listener) => {
            registered.set(code, listener);
            return () => undefined;
        });
    });

    // LOAD-2
    it('onGameLoading gives the listener the game announced by GAME_LOADING', () => {
        const listener = vi.fn();
        onGameLoading(listener);

        registered.get('GAME_LOADING')!(createEvent('GAME_LOADING'));

        expect(listener).toHaveBeenCalledWith({ gameCode: 'game-1', leaders: [new CardCode('0', 'LEADER')] });
    });

    // LOAD-6
    it('onGameSync gives the listener the game of the GAME_SYNC snapshot', () => {
        const listener = vi.fn();
        onGameSync(listener);

        registered.get('GAME_SYNC')!(createEvent('GAME_SYNC'));

        expect(listener).toHaveBeenCalledWith({ gameCode: 'game-1', leaders: [new CardCode('0', 'LEADER')] });
    });
});
