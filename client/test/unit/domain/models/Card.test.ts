import cardFactory from '@test/domain/cardFactory';

describe('Card - Unit tests', () =>{
  describe('Generic tests', () =>{
    test('Should be of type', () => {
      const warriorCard = cardFactory.createWarriorCard();
      
      const result = warriorCard.isType('WARRIOR');

      expect(result).toBe(true);
    });

    test('Shouldn\'t be of type', () => {
      const warriorCard = cardFactory.createWarriorCard();
      
      const result = warriorCard.isType('LEADER');

      expect(result).toBe(false);
    });

    test('Two cards with same code should be equals', () => {
      const cardCode = cardFactory.createCardCode();
      const cardOne = cardFactory.createCard(cardCode);
      const cardTwo = cardFactory.createCard(cardCode);

      const result = cardOne.equals(cardTwo);

      expect(result).toBe(true);
    });
  
    test('Two cards with different code should be differents', () => {
      const cardOne = cardFactory.createCard();
      const cardTwo = cardFactory.createCard();

      const result = cardOne.equals(cardTwo);

      expect(result).toBe(false);
    });
  });

  describe('Leader tests', () =>{
    const leaderCard = cardFactory.createLeaderCard();

    test('Should be a combatant', () => {
      expect(leaderCard.isCombatant()).toBe(true);
    });

    test('Should have statistics', () => {
      expect(leaderCard.hasStatistics()).toBe(true);
    });

    test('TypeDescription should be same as type', () => {
      expect(leaderCard.getTypeDescription()).toBe(leaderCard.type);
    });
  });
  
  describe('Warrior tests', () =>{
    const warriorCard = cardFactory.createWarriorCard();
  
    test('Should be a combatant', () => {
      expect(warriorCard.isCombatant()).toBe(true);
    });

    test('Should have statistics', () => {
      expect(warriorCard.hasStatistics()).toBe(true);
    });

    test('TypeDescription should be same as rarity', () => {
      expect(warriorCard.getTypeDescription()).toBe(warriorCard.rarity);
    });
  });

  describe('Equipment tests', () =>{
    const equipmentCard = cardFactory.createEquipmentCard();
  
    test('Shouldn\'t be a combatant', () => {
      expect(equipmentCard.isCombatant()).toBe(false);
    });

    test('Should have statistics', () => {
      expect(equipmentCard.hasStatistics()).toBe(true);
    });

    test('TypeDescription should be same as type', () => {
      expect(equipmentCard.getTypeDescription()).toBe(equipmentCard.type);
    });
  });

  describe('Spell tests', () =>{
    const spellCard = cardFactory.createSpellCard();
  
    test('Shouldn\'t be a combatant', () => {
      expect(spellCard.isCombatant()).toBe(false);
    });

    test('Shouldn\'t have statistics', () => {
      expect(spellCard.hasStatistics()).toBe(false);
    });

    test('TypeDescription should be same as type', () => {
      expect(spellCard.getTypeDescription()).toBe(spellCard.type);
    });
  });
})