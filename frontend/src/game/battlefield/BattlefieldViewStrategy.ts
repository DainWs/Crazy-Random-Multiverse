import Battlefield from "@/domain/Battlefield";

interface BattlefieldViewStrategy {
  render(graphics: Phaser.GameObjects.Graphics, battlefield: Battlefield): void;
}

export default BattlefieldViewStrategy;