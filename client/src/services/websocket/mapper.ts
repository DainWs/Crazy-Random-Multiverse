import UserDto from '@/services/websocket/dto/UserDto';
import PartyDto from '@/services/websocket/dto/PartyDto';
import PartyListDto from '@/services/websocket/dto/PartyListDto';
import ErrorDto from '@/services/websocket/dto/ErrorDto';
import GameEventDto from '@/services/websocket/dto/GameEventDto';
import GameDto from '@/services/websocket/dto/GameDto';
import ZoneDto from '@/services/websocket/dto/ZoneDto';
import PlayerDto from '@/services/websocket/dto/PlayerDto';
import CardDto from '@/services/websocket/dto/CardDto';
import PositionDto from '@/services/websocket/dto/PositionDto';

import Card, { CardCode } from '@/domain/models/Card';
import Game from '@/domain/models/Game';
import GameError from '@/domain/models/GameError';
import Event, { EventCode, EventDetails } from '@/services/events/Event';
import Party from '@/domain/models/Party';
import Player from '@/domain/models/Player';
import Position, { ZonePosition } from '@/domain/models/Position';
import User from '@/domain/models/User';
import Zone from '@/domain/models/Zone';

const mapUserDtoToUser = (dto: UserDto): User => {
  const user = new User(dto.username);
  user.code = dto.uid;
  return user;
};

const mapPartyDtoToParty = (dto: PartyDto): Party => {
  const party = new Party(dto.code);
  party.name = dto.name;
  party.owner = dto.owner;
  party.userCount = dto.userCount;
  party.maxUsers = dto.maxUsers;
  party.users = dto.users;
  return party;
};

const mapPartyListDtoToPartyList = (dto: PartyListDto): Party[] => {
  const partyList: Party[] = [];
  for (const partyDto of dto.parties) {
    partyList.push(mapPartyDtoToParty(partyDto));
  }
  return partyList;
};

const mapErrorDtoToGameError = (dto: ErrorDto): GameError => {
  return new GameError(dto.key, dto.value, dto.language);
};

const mapGameEventDtoToGameEvent = (dto: GameEventDto): Event => {
  const detailsDto = dto.details;

  const details: EventDetails = { game: mapGameDtoToGame(detailsDto.game) };
  if (detailsDto.sourceCard) details.sourceCard = mapCardDtoToCard(detailsDto.sourceCard);
  if (detailsDto.sourcePlayer) details.sourcePlayer = mapPlayerDtoToPlayer(detailsDto.sourcePlayer);
  if (detailsDto.sourcePosition) details.sourcePosition = mapPositionDtoToPosition(detailsDto.sourcePosition);
  if (detailsDto.targetCard) details.targetCard = mapCardDtoToCard(detailsDto.targetCard);
  if (detailsDto.targetPlayer) details.targetPlayer = mapPlayerDtoToPlayer(detailsDto.targetPlayer);
  if (detailsDto.targetPosition) details.targetPosition = mapPositionDtoToPosition(detailsDto.targetPosition);

  return new Event(dto.code as EventCode, details);
};

function mapGameDtoToGame(dto: GameDto): Game {
  const playerWithTurn = mapPlayerDtoToPlayer(dto.playerWithTurn);

  const game = new Game(dto.code, playerWithTurn);
  game.zones = dto.zones.map(mapZoneDtoToZone);
  return game;
}

function mapZoneDtoToZone(dto: ZoneDto): Zone {
  const owner = mapPlayerDtoToPlayer(dto.owner);

  const zone = new Zone(owner);
  zone.health = dto.health;
  zone.maxHealth = dto.maxHealth;

  const combatants = new Array<Array<Card>>(dto.combatants.length);
  for (const rowNumber in dto.combatants) {
    const rowCombatants = new Array<Card>(dto.combatants[rowNumber].length);
    const rowDtoCombatants = dto.combatants[rowNumber];
  
    for (const columnNumber in rowDtoCombatants) {
      const combatantDto = rowDtoCombatants[columnNumber];
  
      if (combatantDto) {
        rowCombatants[columnNumber] = mapCardDtoToCard(combatantDto);
      }
    }

    combatants[rowNumber] = rowCombatants;
  }
  zone.combatants = combatants;
  console.log(zone.combatants)
  return zone;
}

function mapPlayerDtoToPlayer(dto: PlayerDto): Player {
  const player = new Player(dto.code, dto.name);
  player.isAlive = dto.isAlive;
  player.isSpectator = dto.isSpectator;
  return player;
}

function mapCardDtoToCard(dto: CardDto): Card {
  const cardCode = new CardCode(dto.code.code, dto.code.type);
  const card = new Card(cardCode, dto.type);
  card.name = dto.name;
  card.description = dto.description;
  card.rarity = dto.rarity;
  card.damage = dto.damage;
  card.damageType = dto.damageType;
  card.armor = dto.armor;
  card.armorType = dto.armorType;
  card.health = dto.health;
  card.maxHealth = dto.maxHealth;
  return card;
}

function mapPositionDtoToPosition(dto: PositionDto): Position {
  return new ZonePosition(dto.row, dto.column);
}

export default {
  mapUserDtoToUser,
  mapPartyDtoToParty,
  mapPartyListDtoToPartyList,
  mapErrorDtoToGameError,
  mapGameEventDtoToGameEvent
};
