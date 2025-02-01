import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { login, setAccountInfo } from "@/api/v1";
import User from "@/domain/models/User";

const useSessionStore = defineStore("session", () => {
  const currentUser = ref<User>(new User(defineNewUsername()));

  async function loadSession() {
    currentUser.value = await loadSessionFromLocalstorage();
  }

  watch(currentUser, (newUser) => {
    if (newUser) updateUser(newUser);
  });

  loadSession();

  return {
    currentUser,
    loadSession,
  };
});

async function loadSessionFromLocalstorage() {
  let username = localStorage.getItem("username")
  if (username == null) {
    username = defineNewUsername();
  }

  return await login({ username });
}

async function updateUser(user: User) {
  updateUserInRepository(user);
  await setAccountInfo({ user });
}

function updateUserInRepository(user: User) {
  const encodedUsername = btoa(btoa(user.username));
  localStorage.setItem("username", encodedUsername);
}

function defineNewUsername() {
  return `user-${Math.floor(Math.random() * 1000000)}`;
}

export default useSessionStore;