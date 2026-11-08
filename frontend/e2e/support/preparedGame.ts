import type { CardDto } from '@/api/dtos/CardDto';
import type { GameDto } from '@/api/dtos/GameDto';
import type { PlayerDto } from '@/api/dtos/PlayerDto';
import type { UserDto } from '@/api/dtos/UserDto';
import type { ZoneDto, ZoneSlotDto } from '@/api/dtos/ZoneDto';

interface PositionDto {
    row: number;
    column: number;
}

interface PreparedGame {
    user: UserDto;
    game: GameDto;
    hand: CardDto[];
}

const LOCAL_USER: UserDto = { id: 'user-1', username: 'Tester' };
const RIVAL_NAMES = ['Rival', 'Tercero'];
const HAND_SIZE = 3;
const WARRIOR_COLUMNS = 3;

function createPlayer(code: string, name: string): PlayerDto {
    return { code, name, isSpectator: false, isAlive: true, handSize: HAND_SIZE };
}

function createLeader(code: string): CardDto {
    return {
        catalogCode: { code, type: 'LEADER' },
        name: 'Lider de prueba',
        description: '',
        type: 'LEADER',
        damage: 5,
        damageType: 'PHYSICAL',
        armor: 0,
        armorType: 'PHYSICAL',
        health: 30,
        maxHealth: 30,
        equipment: [],
        protected: true,
        attackAvailable: false,
        targetable: false
    };
}

function createWarrior(code: string, flags: Partial<CardDto> = {}): CardDto {
    return {
        catalogCode: { code, type: 'WARRIOR' },
        name: 'Soldado de prueba',
        description: 'Carta de prueba',
        type: 'WARRIOR',
        rarity: 'COMMON',
        damage: 4,
        damageType: 'PHYSICAL',
        armor: 2,
        armorType: 'PHYSICAL',
        health: 10,
        maxHealth: 10,
        equipment: [],
        protected: false,
        attackAvailable: false,
        targetable: false,
        ...flags
    };
}

function createEquipment(code: string): CardDto {
    return {
        catalogCode: { code, type: 'EQUIPMENT' },
        name: 'Espada de prueba',
        description: 'Equipo de prueba',
        type: 'EQUIPMENT',
        damage: 3,
        armor: 0,
        health: 0
    };
}

function createEmptyRow(): ZoneSlotDto[] {
    return Array.from({ length: WARRIOR_COLUMNS }, () => ({ allowedCombatant: 'WARRIOR' as const }));
}

/** The back row (CON-14) holds one warrior in its first column, and the front row stays empty. */
function createZone(owner: PlayerDto, leaderCode: string, warrior: CardDto): ZoneDto {
    const backRow = createEmptyRow();
    backRow[0].combatant = warrior;

    return {
        owner,
        type: 'BASE',
        combatants: [[{ allowedCombatant: 'LEADER', combatant: createLeader(leaderCode) }], backRow, createEmptyRow()]
    };
}

function createRivalZone(name: string, index: number): ZoneDto {
    const owner = createPlayer(`user-${index + 2}`, name);

    return createZone(owner, String(index + 1), createWarrior(String(index + 11), { targetable: true }));
}

/** A game in progress on the first turn of the local player, with one warrior per zone. */
function createPreparedGame(playerCount: number): PreparedGame {
    const localPlayer = createPlayer(LOCAL_USER.id, LOCAL_USER.username);
    const localZone = createZone(localPlayer, '0', createWarrior('10', { attackAvailable: true }));
    const rivalZones = RIVAL_NAMES.slice(0, playerCount - 1).map(createRivalZone);

    return {
        user: LOCAL_USER,
        game: { code: 'game-1', round: 1, playerWithTurn: localPlayer, zones: [localZone, ...rivalZones] },
        hand: [createWarrior('20'), createWarrior('21'), createEquipment('30')]
    };
}

/** A game that is loading: only the leaders are placed, and there is no round or turn yet (SETUP-2, CON-22). */
function createLoadingGame(playerCount: number): PreparedGame {
    const { user, game } = createPreparedGame(playerCount);
    const zones = game.zones.map((zone) => ({ ...zone, combatants: [zone.combatants[0], createEmptyRow(), createEmptyRow()] }));

    return { user, game: { code: game.code, zones }, hand: [] };
}

/** The state of a game after a change in one slot, as the server would send it in the next event (CON-10). */
function withCombatant(game: GameDto, zone: number, position: PositionDto, combatant: CardDto): GameDto {
    const changed = structuredClone(game);
    changed.zones[zone].combatants[position.row][position.column].combatant = combatant;

    return changed;
}

export type { PreparedGame };
export { LOCAL_USER, createLoadingGame, createPreparedGame, createWarrior, withCombatant };
