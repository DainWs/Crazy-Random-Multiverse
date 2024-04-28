import User from "@/domain/models/User";

interface UserRepository {
    findCurrentUser(): User
    updateCurrentUser(user: User): void
};

export default UserRepository;