import User from '@/domain/models/User';

type UserEventCode = 'USER_UPDATE';

class UserEvent {
  public code: UserEventCode;
  public details: User;

  public constructor(code: UserEventCode, details: User) {
    this.code = code;
    this.details = details;
  }
}

export default UserEvent;
