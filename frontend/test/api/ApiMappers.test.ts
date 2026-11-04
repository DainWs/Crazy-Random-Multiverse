import { describe, expect, it } from 'vitest';
import { toBase64UrlSafe } from '@/api/models/Codification';
import { GAME_EVENT_CODES } from '@/api/models/GameEventCode';
import { notifyListeners } from '@/api/models/Listeners';
import { CardDto, toCard, toCardCode, toCardCodeDto } from '@/api/dtos/CardDto';
import { toPlayer, toPlayerCode } from '@/api/dtos/PlayerDto';
import { toZone } from '@/api/dtos/ZoneDto';
import { toActiveGame, type GameDto } from '@/api/dtos/GameDto';
import { toParty, toMinimalParty } from '@/api/dtos/PartyDto';
import Card, { CardCode } from '@/domain/Card';
import Player from '@/domain/Player';
import Party from '@/domain/Party';
import User from '@/domain/User';

describe('API Models and DTO Mappers', () => {
  describe('Codification', () => {
    it('toBase64UrlSafe replaces +, / and trims padding =', () => {
      // String designed to produce '+', '/' and '=' in standard base64
      const result = toBase64UrlSafe('subjects?_d');
      expect(result).not.toContain('+');
      expect(result).not.toContain('/');
      expect(result).not.toContain('=');
    });
  });

  describe('GameEventCode', () => {
    it('GAME_EVENT_CODES includes the GAME_SYNC snapshot event', () => {
      expect(GAME_EVENT_CODES).toContain('GAME_SYNC');
    });

    it('GAME_EVENT_CODES includes GAME_CANCELLED', () => {
      expect(GAME_EVENT_CODES).toContain('GAME_CANCELLED');
    });

    it('GAME_EVENT_CODES no longer includes GAME_RESTART', () => {
      expect(GAME_EVENT_CODES).not.toContain('GAME_RESTART');
    });
  });

  describe('Listeners', () => {
    it('notifyListeners calls each listener and handles empty list gracefully', () => {
      const calls: number[] = [];
      const listeners = new Set([(val: number) => calls.push(val * 2)]);

      notifyListeners(listeners, 'test', 5);
      expect(calls).toEqual([10]);

      expect(() => notifyListeners(undefined, 'empty', 1)).not.toThrow();
    });
  });

  describe('CardDto', () => {
    it('toCard maps DTO to domain Card with stats and equipment', () => {
      const cardDto: CardDto = {
        catalogCode: { code: '10', type: 'WARRIOR' },
        name: 'Knight',
        description: 'Brave knight',
        type: 'WARRIOR',
        damage: 5,
        damageType: 'PHYSICAL',
        armor: 2,
        armorType: 'PHYSICAL' as const,
        health: 10,
        equipment: [
          {
            catalogCode: { code: '20', type: 'EQUIPMENT' as const },
            name: 'Sword',
            description: 'Iron sword',
            type: 'EQUIPMENT' as const
          }
        ]
      };

      const card = toCard(cardDto);

      expect(card).toBeInstanceOf(Card);
      expect(card.code.code).toBe('10');
      expect(card.damage?.value).toBe(5);
      expect(card.armor?.value).toBe(2);
      expect(card.health?.value).toBe(10);
      expect(card.equipment?.name).toBe('Sword');
    });

    it('toCard maps the runtime state sent by the server', () => {
      const cardDto: CardDto = {
        catalogCode: { code: '11', type: 'WARRIOR' },
        name: 'Archer',
        description: 'Quick archer',
        type: 'WARRIOR',
        protected: true,
        attackAvailable: true,
        targetable: false
      };

      const card = toCard(cardDto);

      expect(card.isProtected).toBe(true);
      expect(card.isAttackAvailable).toBe(true);
      expect(card.isTargetable).toBe(false);
    });

    it('toCard defaults the runtime state to false when the server omits it', () => {
      const card = toCard({ catalogCode: { code: '12', type: 'SPELL' }, name: 'Bolt', description: 'Bolt', type: 'SPELL' });

      expect(card.isProtected).toBe(false);
      expect(card.isAttackAvailable).toBe(false);
      expect(card.isTargetable).toBe(false);
    });

    it('toCardCode keeps every digit of a code that does not fit in a number', () => {
      const hugeCode = '9007199254740993';

      expect(toCardCodeDto(toCardCode({ code: hugeCode, type: 'WARRIOR' }))?.code).toBe(hugeCode);
    });

    it('toCardCode and toCardCodeDto convert bidirectionally', () => {
      const dto = { code: '5', type: 'SPELL' as const };
      const domainCode = toCardCode(dto);

      expect(domainCode).toBeInstanceOf(CardCode);
      expect(toCardCodeDto(domainCode)).toEqual(dto);
      expect(toCardCodeDto(undefined)).toBeUndefined();
    });
  });

  describe('PlayerDto', () => {
    it('toPlayer maps DTO to Player domain', () => {
      const player = toPlayer({
        code: 'p1',
        name: 'Player One',
        isSpectator: false,
        isAlive: true,
        handSize: 3
      });

      expect(player).toBeInstanceOf(Player);
      expect(player.code).toBe('p1');
      expect(player.name).toBe('Player One');
      expect(player.isSpectator).toBe(false);
      expect(player.isAlive).toBe(true);
      expect(player.handSize).toBe(3);
    });

    it('toPlayerCode extracts code from Player, string, or undefined', () => {
      const player = new Player('p-1', 'Name');
      expect(toPlayerCode(player)).toBe('p-1');
      expect(toPlayerCode('p-2')).toBe('p-2');
      expect(toPlayerCode(null)).toBeUndefined();
    });
  });

  describe('ZoneDto', () => {
    const owner = { code: 'p1', name: 'Player One', isSpectator: false, isAlive: true, handSize: 0 };
    const leaderDto: CardDto = {
      catalogCode: { code: '1', type: 'LEADER' },
      name: 'Leader',
      description: 'Leader',
      type: 'LEADER',
      health: 12,
      maxHealth: 20
    };

    it('toZone takes the zone health from the leader card', () => {
      const zone = toZone({ owner, type: 'BASE', combatants: [[{ allowedCombatant: 'LEADER', combatant: leaderDto }]] }, 'FRIENDLY');

      expect([zone.health, zone.maxHealth]).toEqual([12, 20]);
    });

    it('toZone keeps the zone without health when the leader slot is empty', () => {
      const zone = toZone({ owner, type: 'BASE', combatants: [[{ allowedCombatant: 'LEADER' }]] }, 'FRIENDLY');

      expect([zone.health, zone.maxHealth]).toEqual([Infinity, Infinity]);
    });

    it('toZone leaves a slot empty when the server sends no combatant', () => {
      const zone = toZone({ owner, type: 'BASE', combatants: [[{ allowedCombatant: 'LEADER' }]] }, 'FRIENDLY');

      expect(zone.slots[0][0].combatant).toBeNull();
    });
  });

  describe('GameDto', () => {
    const player = { code: 'p1', name: 'One', isSpectator: false, isAlive: true, handSize: 0 };
    const leaderCard = (code: string) => ({ catalogCode: { code, type: 'LEADER' as const }, name: code, description: '', type: 'LEADER' as const });
    const zone = (leaderCode?: string) => ({
      owner: player,
      type: 'BASE' as const,
      combatants: [[{ allowedCombatant: 'LEADER' as const, combatant: leaderCode ? leaderCard(leaderCode) : undefined }], [{ allowedCombatant: 'WARRIOR' as const }]]
    });
    const game = (...zones: ReturnType<typeof zone>[]): GameDto => ({ code: 'game-1', zones });

    it('toActiveGame keeps the game code', () => {
      expect(toActiveGame(game(zone('0'))).gameCode).toBe('game-1');
    });

    it('toActiveGame lists the leader of each zone', () => {
      const activeGame = toActiveGame(game(zone('0'), zone('1')));

      expect(activeGame.leaders).toEqual([new CardCode('0', 'LEADER'), new CardCode('1', 'LEADER')]);
    });

    // DECK-5
    it('toActiveGame lists a repeated leader once', () => {
      const activeGame = toActiveGame(game(zone('0'), zone('0')));

      expect(activeGame.leaders).toEqual([new CardCode('0', 'LEADER')]);
    });

    it('toActiveGame skips a leader slot without a card', () => {
      expect(toActiveGame(game(zone())).leaders).toEqual([]);
    });
  });

  describe('PartyDto', () => {
    const partyDto = {
      code: 'party-xyz',
      name: 'Alpha Party',
      gameMode: 'CLASSIC' as const,
      userCount: 3,
      maxUsers: 4,
      owner: { id: 'u1', username: 'One' },
      users: [{ id: 'u1', username: 'One' }, { id: 'u2', username: 'Two' }, { id: 'u3', username: 'Three' }],
      locked: true,
    };

    it('toParty maps the locked flag', () => {
      expect(toParty(partyDto).isLocked).toBe(true);
    });

    it('toMinimalParty maps the locked flag', () => {
      expect(toMinimalParty(partyDto).isLocked).toBe(true);
    });

    it('toParty maps complete Party entity', () => {
      const party = toParty(partyDto);

      expect(party).toBeInstanceOf(Party);
      expect(party.code).toBe('party-xyz');
      expect(party.owner).toEqual(new User('u1', 'One'));
      expect(party.users).toEqual([new User('u1', 'One'), new User('u2', 'Two'), new User('u3', 'Three')]);
    });

    it('toMinimalParty leaves users empty', () => {
      const minimalParty = toMinimalParty(partyDto);

      expect(minimalParty.code).toBe('party-xyz');
      expect(minimalParty.users).toEqual([]);
    });
  });
});
