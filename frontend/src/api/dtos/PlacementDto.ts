import type { EventDetailsDto } from "@/api/dtos/EventDto";
import type { GameEventCode } from "@/api/models/GameEventCode";
import type { Placement, SlotRef } from "@/domain/Placement";
import { mirrorRow, toZonePosition } from "@/api/dtos/ZonePositionDto";

type PlayerAndPosition = { player?: EventDetailsDto['sourcePlayer']; position?: EventDetailsDto['sourcePosition'] };

function toSlotRef({ player, position }: PlayerAndPosition, rowCount: number): SlotRef | undefined {
  if (!player || !position) {
    return undefined;
  }

  return { player: player.code, position: toZonePosition({ ...position, row: mirrorRow(position.row, rowCount) }) };
}

function present(slots: Array<SlotRef | undefined>): SlotRef[] {
  return slots.filter((slot): slot is SlotRef => slot !== undefined);
}

/** The slots a placed, moved or equipped card changes, with their positions in the frontend rows (CON-14, VIEW-35, VIEW-36). */
const toPlacement = (code: GameEventCode, details: EventDetailsDto, rowCount: number): Placement | undefined => {
  const source = toSlotRef({ player: details.sourcePlayer, position: details.sourcePosition }, rowCount);
  const target = toSlotRef({ player: details.targetPlayer, position: details.targetPosition }, rowCount);

  if (code === 'PLAYER_PUT_CARD') {
    return { settled: present([target]) };
  }

  if (code === 'PLAYER_MOVE_CARD') {
    return { settled: present([source, target]) };
  }

  if (code === 'PLAYER_EQUIP_CARD' && target) {
    return { settled: [], equipped: target };
  }

  return undefined;
}

export { toPlacement };
