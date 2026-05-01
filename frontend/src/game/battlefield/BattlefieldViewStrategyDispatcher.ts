import Battlefield from "@/domain/Battlefield";
import BattlefieldViewStrategy from "@/game/battlefield/BattlefieldViewStrategy";
import TableViewStrategy from "@/game/battlefield/TableViewStrategy";

const tableStrategy = new TableViewStrategy();

function dispatchBattlefieldViewStrategy(battlefield: Battlefield): BattlefieldViewStrategy {
  if (battlefield.skin.battlefieldType === "table") return tableStrategy;
  return tableStrategy;
}

export { dispatchBattlefieldViewStrategy }