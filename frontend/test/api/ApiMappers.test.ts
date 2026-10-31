import { describe, expect, it } from 'vitest';
import { toBase64UrlSafe } from '@/api/models/Codification';
import { notifyListeners } from '@/api/models/Listeners';
import { CardDto, toCard, toCardCode, toCardCodeDto } from '@/api/dtos/CardDto';
import { toPlayer, toPlayerCode } from '@/api/dtos/PlayerDto';
import { toParty, toMinimalParty } from '@/api/dtos/PartyDto';
import Card, { CardCode } from '@/domain/Card';
import Player from '@/domain/Player';
import Party from '@/domain/Party';

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
        code: { code: '10', type: 'WARRIOR' },
        name: 'Knight',
        description: 'Brave knight',
        type: 'WARRIOR',
        damage: 5,
        damageType: 'PHYSICAL',
        armor: 2,
        armorType: 'PHYSICAL' as const,
        health: 10,
        equipment: {
          code: { code: '20', type: 'EQUIPMENT' as const },
          name: 'Sword',
          description: 'Iron sword',
          type: 'EQUIPMENT' as const,
        }
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
        code: { code: '11', type: 'WARRIOR' },
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
      const card = toCard({ code: { code: '12', type: 'SPELL' }, name: 'Bolt', description: 'Bolt', type: 'SPELL' });

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
      });

      expect(player).toBeInstanceOf(Player);
      expect(player.code).toBe('p1');
      expect(player.name).toBe('Player One');
      expect(player.isSpectator).toBe(false);
      expect(player.isAlive).toBe(true);
    });

    it('toPlayerCode extracts code from Player, string, or undefined', () => {
      const player = new Player('p-1', 'Name');
      expect(toPlayerCode(player)).toBe('p-1');
      expect(toPlayerCode('p-2')).toBe('p-2');
      expect(toPlayerCode(null)).toBeUndefined();
    });
  });

  describe('PartyDto', () => {
    const partyDto = {
      code: 'party-xyz',
      name: 'Alpha Party',
      gameMode: 'CLASSIC' as const,
      userCount: 3,
      maxUsers: 4,
      owner: 'u1',
      users: ['u1', 'u2', 'u3'],
    };

    it('toParty maps complete Party entity', () => {
      const party = toParty(partyDto);

      expect(party).toBeInstanceOf(Party);
      expect(party.code).toBe('party-xyz');
      expect(party.users).toEqual(['u1', 'u2', 'u3']);
    });

    it('toMinimalParty leaves users empty', () => {
      const minimalParty = toMinimalParty(partyDto);

      expect(minimalParty.code).toBe('party-xyz');
      expect(minimalParty.users).toEqual([]);
    });
  });
});
