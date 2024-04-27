import { Game } from "@/domain/game/game";

interface GameRepository {
    existCurrentGame(): boolean,
    findCurrentGame(): Game | undefined,
    updateCurrentGame(game: Game): void
}

export default GameRepository