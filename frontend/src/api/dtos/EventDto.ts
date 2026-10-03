import Card, { CardCode, CardRarity, CardType } from "@/domain/Card";
import { Damage, Armor, Health } from "@/domain/Statistics";

enum GameEventCode {
  GAME_RESTART = 'GAME_RESTART',
  GAME_CREATED = 'GAME_CREATED',
  GAME_LOADING = 'GAME_LOADING',
  GAME_START = 'GAME_START',
  GAME_END = 'GAME_END',
  GAME_END_WITH_WINNER = 'GAME_END_WITH_WINNER',
  GAME_END_WITH_TIE = 'GAME_END_WITH_TIE',
  TURN_CHANGE = 'TURN_CHANGE',
  ROUND_CHANGE = 'ROUND_CHANGE',
  PLAYER_DIE = 'PLAYER_DIE',
  PLAYER_SURRENDER = 'PLAYER_SURRENDER',
  PLAYER_RECEIVE_CARD = 'PLAYER_RECEIVE_CARD',
  PLAYER_PUT_CARD = 'PLAYER_PUT_CARD',
  PLAYER_MOVE_CARD = 'PLAYER_MOVE_CARD',
  PLAYER_ATTACK_CARD = 'PLAYER_ATTACK_CARD',
  PLAYER_EQUIP_CARD = 'PLAYER_EQUIP_CARD',
  PLAYER_USE_CARD = 'PLAYER_USE_CARD',
  PLAYER_PASS_TURN = 'PLAYER_PASS_TURN'
}

interface CardDto {
  code: {
    number: number;
    type: CardType;
  };
  name: string;
  description: string;
  type: CardType;
  rarity?: CardRarity;
  damage?: { value: number; type: any };
  armor?: { value: number; type: any };
  health?: { value: number; maxValue: number };
  activeSkill?: any;
  passiveSkill?: any;
  equipment?: CardDto;
}

interface PlayerDto {
  code: string;
  name: string;
  isSpectator?: boolean;
  isAlive?: boolean;
}

interface PositionDto {
  zoneIndex?: number;
  slotIndex?: number;
  row?: number;
  column?: number;
}

interface GameDto {
  gameCode: string;
  turn?: number;
  round?: number;
  currentTurnPlayer?: string;
  players?: PlayerDto[];
  [key: string]: any;
}

interface EventDetailsDto {
  game?: GameDto;
  gameDto?: GameDto;
  sourcePlayer?: PlayerDto;
  sourceCard?: CardDto;
  sourcePosition?: PositionDto;
  targetPlayer?: PlayerDto;
  targetCard?: CardDto;
  targetPosition?: PositionDto;
  playerHand?: CardDto[];
  [key: string]: any;
}

interface EventDto {
  code: GameEventCode | string;
  details?: EventDetailsDto;
  timestamp?: number;
}

interface ExceptionCodeDto {
  code: string | number;
  message?: string;
}

function cardFromDto(dto: CardDto): Card {
  const code = new CardCode(dto.code.number, dto.code.type);
  const card = new Card({
    code,
    name: dto.name,
    description: dto.description,
    type: dto.type,
    rarity: dto.rarity
  });

  if (dto.damage) {
    card.damage = Damage(dto.damage.type, dto.damage.value);
  }

  if (dto.armor) {
    card.armor = Armor(dto.armor.type, dto.armor.value);
  }

  if (dto.health) {
    card.health = Health(dto.health.value, dto.health.maxValue);
  }

  if (dto.activeSkill) {
    card.activeSkill = dto.activeSkill;
  }

  if (dto.passiveSkill) {
    card.passiveSkill = dto.passiveSkill;
  }

  if (dto.equipment) {
    card.equipment = cardFromDto(dto.equipment) as any;
  }

  return card;
}

export type { CardDto, PlayerDto, PositionDto, GameDto, EventDetailsDto, EventDto, ExceptionCodeDto };
export { GameEventCode, cardFromDto }