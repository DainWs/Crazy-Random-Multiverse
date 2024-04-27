import { User } from "@/domain/UserRepository"

type Party = {
    code: string,
    name: string,
    users: Array<User>
};

export { Party };