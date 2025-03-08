import Card from '@/domain/models/Card';
import cardFactory from '@test/domain/cardFactory';
import handFactory from '@test/domain/handFactory';
import playerFactory from '@test/domain/playerFactory';

describe('Hand - Unit tests', () =>{
  test('Given player should be hand owner', () => {
    const player = playerFactory.createPlayer();
    const hand = handFactory.createHand(player);

    expect(hand.isOwner(player.code)).toBeTruthy();
  });

  test('Given player shouldn\'t be hand owner', () => {
    const player = playerFactory.createPlayer();
    const hand = handFactory.createHand();

    expect(hand.isOwner(player.code)).toBeFalsy();
  });

  test('Card should be added to hand', () => {
    const emptyCardList: Card[] = [];
    const hand = handFactory.createHand(undefined, emptyCardList);
    const card = cardFactory.createCard();

    hand.addCard(card);

    expect(hand.cards.length).toBeGreaterThan(0);
  });

  test('Card should be removed from hand', () => {
    const card = cardFactory.createCard();
    const hand = handFactory.createHand(undefined, [card]);

    hand.removeCard(card);

    expect(hand.cards.length).toBeLessThanOrEqual(0);
  });

  test('Hand should find the card', () => {
    const card = cardFactory.createCard();
    const hand = handFactory.createHand(undefined, [card]);

    const findedCard = hand.findCard(card.code);

    expect(findedCard).toBe(card);
  });
});