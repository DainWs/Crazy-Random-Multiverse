type User = {
    username: string
};

interface UserRepository {
    findCurrentUser(): User
    updateCurrentUser(user: User): void
};

export { User };
export default UserRepository;