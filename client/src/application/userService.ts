import User from '@/domain/models/User';
import UserEvent from '@/domain/events/UserEvent';
import { userRepository } from '@/infrastructure/repositories';
import { userEventService } from '@/application/eventService';

const updateLocalUser = (user: User) => {
  const oldUser = userRepository.findCurrentUser();

  if (oldUser.username !== user.username) {
    userRepository.updateCurrentUser(user);

    userEventService.notify(new UserEvent('USER_UPDATE', user));
  }
};

const getUser = () => {
  return userRepository.findCurrentUser();
};

export { updateLocalUser, getUser };
