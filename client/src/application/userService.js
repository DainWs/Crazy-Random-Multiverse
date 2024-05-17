import { userRepository } from '@/infrastructure/repositories';
import { triggerEvent } from '@/application/eventService';

const updateLocalUser = (user) => {
  const oldUser = userRepository.findCurrentUser();

  if (oldUser.username !== user.username) {
    userRepository.updateCurrentUser(user);

    triggerEvent({ code: 'USER_UPDATE', details: user });
  }
};

const getUser = () => {
  return userRepository.findCurrentUser();
};

export { updateLocalUser, getUser };
