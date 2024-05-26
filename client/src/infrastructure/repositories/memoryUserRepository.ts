import User from '@/domain/models/User';

let currentUser: User;

const getCurrentUser = (): User => {
  return currentUser;
};

const updateCurrentUser = (user: User): void => {
  currentUser = user;
};

export default {
  getCurrentUser,
  updateCurrentUser
};
