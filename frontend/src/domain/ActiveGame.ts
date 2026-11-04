import type { CardCode } from "@/domain/Card";
import type { GameCode } from "@/domain/GameConfiguration";

/** The game the user is loading or playing, as the server announced it. */
type ActiveGame = {
  gameCode: GameCode;
  leaders: CardCode[];
};

export type { ActiveGame };
