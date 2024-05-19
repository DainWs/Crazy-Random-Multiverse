import Event from '@/domain/events/Event';
import GameError from '@/domain/models/GameError';

type ErrorEventCode = 'ERROR';

class ErrorEvent extends Event<GameError> {
  public constructor(code: ErrorEventCode, details: GameError) {
    super(code, details);
  }

  public getCode(): ErrorEventCode {
    return this.getCode();
  }
}

export { ErrorEventCode };
export default ErrorEvent;
