import User from "@/domain/models/User";

const createUser = (name?: string) => {
  let code = `user-${Math.floor(Math.random() * 1000000)}`;
  if (!name) name = `user-${Math.floor(Math.random() * 1000000)}`;
  const user = new User(name);
  user.code = code;
  return user;
}

export default {
  createUser
};