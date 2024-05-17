import CardDto from '@/infrastructure/stomp/dto/CardDto';
import ErrorDto from '@/infrastructure/stomp/dto/ErrorDto';
import GameDto from '@/infrastructure/stomp/dto/GameDto';
import GameEventDto from '@/infrastructure/stomp/dto/GameEventDto';
import PartyDto from '@/infrastructure/stomp/dto/PartyDto';
import PartyListDto from '@/infrastructure/stomp/dto/PartyListDto';
import PlayerDto from '@/infrastructure/stomp/dto/PlayerDto';
import PositionDto from '@/infrastructure/stomp/dto/PositionDto';
import UserDto from '@/infrastructure/stomp/dto/UserDto';
import ZoneDto from '@/infrastructure/stomp/dto/ZoneDto';

import Card, {CardCode} from '@/domain/models/Card';
import Game from '@/domain/models/Game';
import GameError from '@/domain/models/GameError';
import GameEvent, {GameEventDetails} from '@/domain/events/GameEvent';
import Party from '@/domain/models/Party';
import PartyList from '@/domain/models/PartyList';
import Player from '@/domain/models/Player';
import Position from '@/domain/models/Position';
import User from '@/domain/models/User';
import Zone from '@/domain/models/Zone';

const mapUserDtoToUser = (dto: UserDto): User => {
  return new User(dto.username);
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

const mapPartyListDtoToPartyList = (dto: PartyListDto): PartyList => {
  const partyList = new PartyList();
  for (const partyDto of dto.parties) {
    partyList.add(mapPartyDtoToParty(partyDto));
  }
  return partyList;
};

const mapErrorDtoToGameError = (dto: ErrorDto): GameError => {
  return new GameError(dto.key, dto.value, dto.language);
};

const mapGameEventDtoToGameEvent = (dto: GameEventDto): GameEvent => {
  const detailsDto = dto.details;

  const details: GameEventDetails = {game: mapGameDtoToGame(detailsDto.game)};
  if (detailsDto.sourceCard)
    details.sourceCard = mapCardDtoToCard(detailsDto.sourceCard);
  if (detailsDto.sourcePlayer)
    details.sourcePlayer = mapPlayerDtoToPlayer(detailsDto.sourcePlayer);
  if (detailsDto.sourcePosition)
    details.sourcePosition = mapPositionDtoToPosition(
      detailsDto.sourcePosition
    );
  if (detailsDto.targetCard)
    details.targetCard = mapCardDtoToCard(detailsDto.targetCard);
  if (detailsDto.targetPlayer)
    details.targetPlayer = mapPlayerDtoToPlayer(detailsDto.targetPlayer);
  if (detailsDto.targetPosition)
    details.targetPosition = mapPositionDtoToPosition(
      detailsDto.targetPosition
    );

  return new GameEvent(dto.code, details);
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

  const combatants = new Array<Array<Card>>();
  for (const rowNumber in dto.combatants) {
    const rowCombatants = new Array<Card>();
    const rowDtoCombatants = dto.combatants[rowNumber];
    for (const columnNumber in rowDtoCombatants) {
      const combatantDto = rowDtoCombatants[columnNumber];
      rowCombatants[columnNumber] = mapCardDtoToCard(combatantDto);
    }

    combatants[rowNumber] = rowCombatants;
  }
  zone.combatants = combatants;
  return zone;
}

function mapPlayerDtoToPlayer(dto: PlayerDto): Player {
  const player = new Player(dto.code, dto.name);
  player.isAlive = dto.isAlive;
  player.isSpectator = dto.isSpectator;
  return player;
}

function mapCardDtoToCard(dto: CardDto): Card {
  const cardCode = new CardCode(dto.code.value, dto.code.type);
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
  return new Position(dto.row, dto.column);
}

export default {
  mapUserDtoToUser,
  mapPartyDtoToParty,
  mapPartyListDtoToPartyList,
  mapErrorDtoToGameError,
  mapGameEventDtoToGameEvent
};
