import type { PlayerCode } from "@/domain/Player";
import type { ZonePosition } from "@/domain/Position";

/** A slot of a zone, as an event names it. */
type SlotRef = {
  player: PlayerCode;
  position: ZonePosition;
};

/** The cards an event of the board put in their slots: which ones settle (VIEW-35) and which one received equipment (VIEW-36). */
type Placement = {
  settled: SlotRef[];
  equipped?: SlotRef;
};

export type { Placement, SlotRef };
