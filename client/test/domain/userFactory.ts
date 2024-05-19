import User from "@/domain/models/User";

const createUser = (name?: string) => {
  if (!name) name = `user-${Math.floor(Math.random() * 1000000)}`;
  return new User(name);
}

export default {
  createUser
};