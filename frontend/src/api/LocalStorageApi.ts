import User from "@/domain/User";
import Card from "@/domain/Card";

function loadUser(): User {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    const userData = JSON.parse(userJson);
    return new User(userData.code, userData.name);
  }

  const code = Math.random().toString(36).substring(2, 10);
  const user = new User(code, randomUsername());
  saveUser(user);
  return user;
}

function saveUser(user: User): void {
  localStorage.setItem('user', JSON.stringify(user));
}

const firstNames = ['Lucía', 'Mateo', 'Sofía', 'Diego', 'Valentina', 'Leo', 'Martina', 'Gabriel'];
const lastNames = ['Gómez', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Rodríguez', 'Díaz'];

function randomUsername() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

function loadHand(): Card[] {
  const handJson = sessionStorage.getItem('hand');
  if (handJson) {
    return JSON.parse(handJson);
  }
  return [];
}

function saveHand(hand: Card[]): void {
  sessionStorage.setItem('hand', JSON.stringify(hand));
}

export { 
  loadUser, saveUser,
  loadHand, saveHand,
};