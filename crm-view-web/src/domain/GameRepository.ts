import Game from '@/domain/models/Game';

interface GameRepository {
  existCurrentGame(): boolean;
  findCurrentGame(): Game | undefined;
  updateCurrentGame(game: Game): void;
}

export default GameRepository;
