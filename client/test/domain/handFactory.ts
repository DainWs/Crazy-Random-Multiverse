import playerFactory from "@test/domain/playerFactory";
import cardFactory from "@test/domain/cardFactory";

import Card from "@/domain/models/Card";
import Hand from "@/domain/models/Hand";
import { PlayerCode } from "@/domain/models/Player";

const createHand = (playerCode?: PlayerCode, cards?: Card[]): Hand => {
  if (!playerCode) playerCode = playerFactory.createPlayerCode();
  if (!cards) cards = generateCards();
  const hand = new Hand(playerCode);
  hand.cards = cards;
  return hand;
}

function generateCards(): Card[] {
  const cardsCount = Math.floor(Math.random() * 10) + 1;
  const cards = new Array(cardsCount);

  for (let i = 0; i < cardsCount; i++) {
    cards.push(cardFactory.createCard());
  }
  return cards;
}

export default {
  createHand
};