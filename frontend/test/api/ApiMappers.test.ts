import { describe, expect, it } from 'vitest';
import { toBase64UrlSafe } from '@/api/models/Codification';
import { GAME_EVENT_CODES } from '@/api/models/GameEventCode';
import { notifyListeners } from '@/api/models/Listeners';
import { CardDto, toCard, toCardCode, toCardCodeDto } from '@/api/dtos/CardDto';
import { toPlayer, toPlayerCode } from '@/api/dtos/PlayerDto';
import { toActionDto } from '@/api/dtos/ActionDto';
import { toZone } from '@/api/dtos/ZoneDto';
import { toActiveGame, toGameSnapshot, type GameDto } from '@/api/dtos/GameDto';
import { toParty, toMinimalParty } from '@/api/dtos/PartyDto';
import Action from '@/domain/Action';
import type ActionEvent from '@/domain/ActionEvent';
import Card, { CardCode } from '@/domain/Card';
import Player from '@/domain/Player';
import { ZonePosition } from '@/domain/Position';
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
      const pieceNames: string[] = card.equipment.map((piece) => piece.name);
      expect(pieceNames).toEqual(['Sword']);
    });

    // EQUIP-1, CON-34
    it('toCard maps the values of a piece of equipment, which has no types', () => {
      const pieceDto: CardDto = {
        catalogCode: { code: '0', type: 'EQUIPMENT' },
        name: 'Pistolon',
        type: 'EQUIPMENT',
        damage: 15,
        armor: -2
      };

      const piece = toCard(pieceDto);

      expect([piece.damage?.value, piece.armor?.value, piece.health]).toEqual([15, -2, undefined]);
    });

    // CON-27
    it('toCard sums the values of the pieces of a combatant', () => {
      const pieceDto = (damage: number): CardDto => ({
        catalogCode: { code: String(damage), type: 'EQUIPMENT' },
        name: 'Piece',
        type: 'EQUIPMENT',
        damage
      });
      const warriorDto: CardDto = {
        catalogCode: { code: '10', type: 'WARRIOR' },
        name: 'Knight',
        type: 'WARRIOR',
        equipment: [pieceDto(15), pieceDto(5)]
      };

      const warrior = toCard(warriorDto);

      expect(warrior.getEquipmentValue('Damage')).toBe(20);
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
        isAlive: true
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

  describe('ZoneDto', () => {
    const owner = { code: 'p1', name: 'Player One', isSpectator: false, isAlive: true };
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

    // CON-14
    describe('with the rows of the server', () => {
      const warriorSlots = (count: number) => Array.from({ length: count }, () => ({ allowedCombatant: 'WARRIOR' as const }));
      const baseZone = () => toZone({ owner, type: 'BASE', combatants: [[{ allowedCombatant: 'LEADER', combatant: leaderDto }], warriorSlots(3), warriorSlots(2)] }, 'FRIENDLY');

      it('toZone puts the leader row last', () => {
        expect(baseZone().slots[2][0].allowedCombatant).toBe('LEADER');
      });

      it('toZone puts the row closest to the center first', () => {
        expect(baseZone().slots[0]).toHaveLength(2);
      });

      it('toZone puts the row next to the leader second', () => {
        expect(baseZone().slots[1]).toHaveLength(3);
      });

      it('toZone gives each slot its row in the frontend', () => {
        const positions = baseZone().slots.map((row) => row[0].position.row);

        expect(positions).toEqual([0, 1, 2]);
      });

      it('toZone gives each slot its column', () => {
        const columns = baseZone().slots[1].map((slot) => slot.position.column);

        expect(columns).toEqual([0, 1, 2]);
      });

      it('toZone takes the zone health from a leader that is not in row 0', () => {
        expect(baseZone().health).toBe(12);
      });
    });

    it('toZone leaves a slot empty when the server sends no combatant', () => {
      const zone = toZone({ owner, type: 'BASE', combatants: [[{ allowedCombatant: 'LEADER' }]] }, 'FRIENDLY');

      expect(zone.slots[0][0].combatant).toBeNull();
    });
  });

  describe('GameDto', () => {
    const player = { code: 'p1', name: 'One', isSpectator: false, isAlive: true };
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

    describe('toGameSnapshot', () => {
      const other = { code: 'p2', name: 'Two', isSpectator: false, isAlive: true };
      const zoneOf = (owner: typeof player) => ({ ...zone('0'), owner });
      const twoPlayers = (overrides: Partial<GameDto> = {}): GameDto => ({ code: 'game-1', zones: [zoneOf(other), zoneOf(player)], ...overrides });

      it('takes the local player from the zones', () => {
        expect(toGameSnapshot(twoPlayers(), 'p1').player.code).toBe('p1');
      });

      it('takes the zone of the local player', () => {
        expect(toGameSnapshot(twoPlayers(), 'p1').playerZone.owner.code).toBe('p1');
      });

      it('keeps the order of the zones', () => {
        expect(toGameSnapshot(twoPlayers(), 'p1').zones.map((snapshotZone) => snapshotZone.owner.code)).toEqual(['p2', 'p1']);
      });

      // VIEW-13
      it('makes the zones of the other players enemies', () => {
        const teams = toGameSnapshot(twoPlayers(), 'p1').zones.map((snapshotZone) => snapshotZone.team);

        expect(teams).toEqual(['ENEMY', 'FRIENDLY']);
      });

      it('counts the zones as players', () => {
        expect(toGameSnapshot(twoPlayers(), 'p1').gameConfiguration.playerCount).toBe(2);
      });

      it('keeps the game code', () => {
        expect(toGameSnapshot(twoPlayers(), 'p1').gameConfiguration.gameCode).toBe('game-1');
      });

      it('puts the enemies on the battlefield', () => {
        expect(toGameSnapshot(twoPlayers(), 'p1').battlefield.enemyZones.map((enemy) => enemy.owner.code)).toEqual(['p2']);
      });

      // CON-32
      it('keeps the player with the turn', () => {
        const snapshot = toGameSnapshot(twoPlayers({ playerWithTurn: other }), 'p1');

        expect(snapshot.playerWithTurn).toBe('p2');
      });

      it('has no player with the turn before the first TURN_CHANGE', () => {
        expect(toGameSnapshot(twoPlayers(), 'p1').playerWithTurn).toBeUndefined();
      });

      it('keeps the round', () => {
        expect(toGameSnapshot(twoPlayers({ round: 3 }), 'p1').round).toBe(3);
      });

      it('throws when the game has no zone for the local player', () => {
        expect(() => toGameSnapshot(twoPlayers(), 'p9')).toThrowError('Game game-1 has no zone for the player p9');
      });
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

  describe('ActionDto', () => {
    const ROW_COUNT = 3;

    const createAction = (): Action => {
      const source = { position: new ZonePosition(1, 0), player: new Player('p-1', 'One'), card: null } as unknown as ActionEvent;
      const target = { position: new ZonePosition(2, 1), player: new Player('p-2', 'Two'), card: null } as unknown as ActionEvent;
      return new Action('game-1', source, target);
    };

    it.each(['MOVE_ACTION', 'EQUIP_ACTION', 'ATTACK_ACTION'] as const)('toActionDto sends the target player of %s', (type) => {
      expect(toActionDto(type, createAction(), ROW_COUNT).targetPlayer).toBe('p-2');
    });

    // CON-14
    it('toActionDto numbers the target row from the leader row', () => {
      expect(toActionDto('PUT_ACTION', createAction(), ROW_COUNT).targetPosition).toEqual({ row: 0, column: 1 });
    });

    it('toActionDto sends no source position for a card of the hand', () => {
      const action = createAction();
      action.sourcePosition = null;

      expect(toActionDto('PUT_ACTION', action, ROW_COUNT).sourcePosition).toBeUndefined();
    });

    it('toActionDto sends the source player', () => {
      expect(toActionDto('MOVE_ACTION', createAction(), ROW_COUNT).sourcePlayer).toBe('p-1');
    });
  });
});
