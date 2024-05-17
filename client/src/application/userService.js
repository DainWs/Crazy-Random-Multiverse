import { userRepository } from '@/infrastructure/repositories';
import { userEventService } from '@/application/eventService';

const updateLocalUser = (user) => {
  const oldUser = userRepository.findCurrentUser();

  if (oldUser.username !== user.username) {
    userRepository.updateCurrentUser(user);

    userEventService.notify({ code: 'USER_UPDATE', details: user });
  }
};

const getUser = () => {
  return userRepository.findCurrentUser();
};

export { updateLocalUser, getUser };
