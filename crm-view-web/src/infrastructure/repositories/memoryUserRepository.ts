import User from '@/domain/models/User';

let currentUser: User;

const findCurrentUser = (): User => {
  return currentUser;
};

const updateCurrentUser = (user: User): void => {
  currentUser = user;
};

export default {
  findCurrentUser,
  updateCurrentUser
};
