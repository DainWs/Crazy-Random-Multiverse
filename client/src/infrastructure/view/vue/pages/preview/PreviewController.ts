import { getUser, getUserAsPlayer } from "@/application/userService";
import Card from "@/domain/models/Card";
import Player from "@/domain/models/Player";
import Zone from "@/domain/models/Zone";
import cardFactory from "@vue-pages/preview/cardFactory";
import router from '@vue-root/configuration/router';

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
  const user = getUser();
  const zone = new Zone(new Player(user.code, user.username));
  zone.health = 75;
  zone.maxHealth = 100;
  zone.combatants = [];
  zone.combatants[0] = new Array(3);
  zone.combatants[1] = new Array(3);
  zone.combatants[2] = [ cardFactory.createCard() ];
  return zone;
}

export default {
  generateCards,
  generateZone,
  onBackClick
};
