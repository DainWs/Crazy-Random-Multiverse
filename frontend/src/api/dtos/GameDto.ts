import type { ActiveGame } from "@/domain/ActiveGame";
import type { CardCode } from "@/domain/Card";
import type { GameMode } from "@/domain/GameConfiguration";
import type { PlayerCode } from "@/domain/Player";
import type Team from "@/domain/Team";
import type { GameSnapshot } from "@/core/StoreSystem";
import { toCardCode } from "@/api/dtos/CardDto";
import { PlayerDto } from "@/api/dtos/PlayerDto";
import { ZoneDto, ZoneSlotDto, toZone } from "@/api/dtos/ZoneDto";
import Battlefield from "@/domain/Battlefield";
import { DEFAULT_SKIN } from "@/domain/BattlefieldSkin";
import GameConfiguration, { GameCode } from "@/domain/GameConfiguration";

/** The game mode is not in the GameDto: Classic is the only one (SCOPE-3). */
const CLASSIC_GAME_MODE: GameMode = 'CLASSIC';

interface GameDto {
  code: GameCode;
  round?: number;
  playerWithTurn?: PlayerDto;
  zones: ZoneDto[];
}

/** The leaders of every zone: they are known while the game loads, so their images can be downloaded then (LOAD-2). */
const toActiveGame = (dto: GameDto): ActiveGame => {
  const slots: ZoneSlotDto[] = [];
  for (const zone of dto.zones) {
    for (const row of zone.combatants) {
      slots.push(...row);
    }
  }

  return { gameCode: dto.code, leaders: toLeaderCodes(slots) };
};

function toLeaderCodes(slots: ZoneSlotDto[]): CardCode[] {
  const leaders = new Map<string, CardCode>();
  for (const slot of slots) {
    if (slot.allowedCombatant === 'LEADER' && slot.combatant) {
      const leader = toCardCode(slot.combatant.catalogCode);
      leaders.set(leader.text(), leader);
    }
  }

  return [...leaders.values()];
}

/** The state of the game seen by the local player. The server has no teams, so every other zone is an enemy (VIEW-13). */
const toGameSnapshot = (dto: GameDto, localPlayerCode: PlayerCode): GameSnapshot => {
  const zones = dto.zones.map((zone) => toZone(zone, toTeam(zone, localPlayerCode)));
  const playerZone = zones.find((zone) => zone.owner.code === localPlayerCode);
  if (!playerZone) {
    throw new Error(`Game ${dto.code} has no zone for the player ${localPlayerCode}`);
  }

  const gameConfiguration = new GameConfiguration(dto.code, CLASSIC_GAME_MODE, zones.length);
  const battlefield = new Battlefield(DEFAULT_SKIN, gameConfiguration, playerZone);
  battlefield.addZones(zones);

  return {
    gameConfiguration,
    battlefield,
    round: dto.round,
    playerWithTurn: dto.playerWithTurn?.code,
    zones,
    player: playerZone.owner,
    playerZone
  };
};

function toTeam(zone: ZoneDto, localPlayerCode: PlayerCode): Team {
  return zone.owner.code === localPlayerCode ? 'FRIENDLY' : 'ENEMY';
}

export type { GameDto }
export { toActiveGame, toGameSnapshot }