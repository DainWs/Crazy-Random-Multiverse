import Game from "@/domain/models/Game";
import Hand from "@/domain/models/Hand";
import Player from "@/domain/models/Player";
import User from "@/domain/models/User";
import Zone from "@/domain/models/Zone";

interface Context {
  getUser(): User;

  setCurrentGame(game: Game): void;
  getCurrentGame(): Game;

  setPlayerInfo(player: Player): void;
  getPlayerInfo(): Player;

  setPlayerHand(hand: Hand): void;
  getPlayerHand(): Hand;

  setVisibleZone(zone: Zone): void;
  getVisibleZone(): Zone;
}

export default Context;