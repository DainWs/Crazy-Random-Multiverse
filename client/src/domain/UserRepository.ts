import User from '@/domain/models/User';

interface UserRepository {
  getCurrentUser(): User;
  updateCurrentUser(user: User): void;
}

export default UserRepository;
