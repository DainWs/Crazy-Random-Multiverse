import Card from "@/domain/models/Card";
import Player from "@/domain/models/Player";
import Zone from "@/domain/models/Zone";
import cardFactory from "@view/pages/preview/cardFactory";
import router from '@view/configuration/router';
import useSessionStore from "@/stores/SessionStore";

const generateCards = (count: number): Card[] => {
  const cards: Card[] = [];
  for (let i = 0; i < count; i++) {
    cards.push(cardFactory.createCard());
  }

  return cards;
}

const onBackClick = () => {
  router.push('/');
};

const generateZone = () => {
  const sessionStore = useSessionStore();
  const zone = new Zone(new Player(sessionStore.currentUser.code, sessionStore.currentUser.username));
  zone.health = 75;
  zone.maxHealth = 100;
  zone.combatants = [];
  zone.combatants[0] = new Array(3);
  zone.combatants[1] = new Array(3);
  zone.combatants[1][1] = cardFactory.createCard();
  return zone;
}

export default {
  generateCards,
  generateZone,
  onBackClick
};
