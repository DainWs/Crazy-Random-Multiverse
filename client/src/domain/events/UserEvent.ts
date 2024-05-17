import Event from '@/domain/events/Event';
import User from '@/domain/models/User';

type UserEventCode = 'USER_UPDATE';

class UserEvent extends Event<User> {
  public constructor(code: UserEventCode, details: User) {
    super(code, details);
  }

  public getCode(): UserEventCode {
    return this.getCode();
  }
}

export { UserEventCode };
export default UserEvent;
