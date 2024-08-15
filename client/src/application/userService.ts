import User from '@/domain/models/User';
import UserEvent from '@/domain/events/UserEvent';
import { gameRepository, userRepository } from '@/infrastructure/repositories';
import { userEventService } from '@/domain/services/eventService';

const updateLocalUser = (user: User) => {
  const oldUser = userRepository.getCurrentUser();

  if (oldUser.username !== user.username) {
    userRepository.updateCurrentUser(user);

    userEventService.notify(new UserEvent('USER_UPDATE', user));
  }
};

const getUser = () => {
  return userRepository.getCurrentUser();
};

const getUserAsPlayer = () => {
  const user = userRepository.getCurrentUser();

  const game = gameRepository.findCurrentGame();
  const player = game?.getPlayerWithCode(user.code);

  if (player == undefined) {
    throw new Error("Player could not be found");
  }

  return player;
}

export { updateLocalUser, getUser, getUserAsPlayer };
