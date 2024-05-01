import { Game } from '@/domain/models/Game';
import { Hand } from '@/domain/models/Hand';
import { Player } from '@/domain/models/Player';
import Event from '@/domain/events/Event';

type Context = {
  game: Game;
  player: Player;
  hand: Hand;
};

type EventHandler = (event: Event, context?: Context) => Promise<void>;

export { Context, EventHandler };
