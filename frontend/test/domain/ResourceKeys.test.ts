import { describe, expect, it } from 'vitest';
import type { CardRarity, CardType } from '@/domain/Card';
import Card, { CardCode } from '@/domain/Card';
import ZoneSlot from '@/domain/ZoneSlot';
import { Armor, Damage, Health } from '@/domain/Statistics';
import { ZonePosition } from '@/domain/Position';
import { cardAudioKey, cardFrameKey, cardImageKey, slotMarkKey, statisticIconKey } from '@/domain/ResourceKeys';

function createCard(type: CardType, code: string, rarity?: CardRarity): Card {
  return new Card({ code: new CardCode(code, type), name: 'name', description: '', type, rarity });
}

// CON-30
describe('ResourceKeys', () => {
  describe('cardImageKey', () => {
    it('joins the rarity and the code for a warrior', () => {
      expect(cardImageKey('WARRIOR', '4', 'RARE')).toBe('warrior.rare.4');
    });

    it('joins the type and the code for a leader', () => {
      expect(cardImageKey('LEADER', '0')).toBe('leader.0');
    });

    it('joins the type and the code for an equipment', () => {
      expect(cardImageKey('EQUIPMENT', '1')).toBe('equipment.1');
    });

    it('throws for a warrior without rarity', () => {
      expect(() => cardImageKey('WARRIOR', '4')).toThrow();
    });
  });

  describe('cardFrameKey', () => {
    it.each<[CardRarity, string]>([
      ['COMMON', 'frame.common'],
      ['UNCOMMON', 'frame.uncommon'],
      ['RARE', 'frame.rare'],
      ['EPIC', 'frame.epic'],
      ['LEGENDARY', 'frame.legendary'],
      ['MYTHIC', 'frame.mythic']
    ])('uses the rarity %s for a warrior', (rarity, expected) => {
      expect(cardFrameKey('WARRIOR', rarity)).toBe(expected);
    });

    it('uses the type for a leader', () => {
      expect(cardFrameKey('LEADER')).toBe('frame.leader');
    });

    it('uses the type for an equipment', () => {
      expect(cardFrameKey('EQUIPMENT')).toBe('frame.equipment');
    });

    it('throws for a warrior without rarity', () => {
      expect(() => cardFrameKey('WARRIOR')).toThrow();
    });
  });

  describe('cardAudioKey', () => {
    it('appends the action to the image key', () => {
      expect(cardAudioKey('warrior.rare.4', 'put')).toBe('warrior.rare.4.put');
    });

    it('appends the variant to an attack', () => {
      expect(cardAudioKey('warrior.rare.4', 'attack', 2)).toBe('warrior.rare.4.attack.2');
    });

    it('ignores the variant of an action that has none', () => {
      expect(cardAudioKey('warrior.rare.4', 'die', 2)).toBe('warrior.rare.4.die');
    });
  });

  it('statisticIconKey joins the kind and the lowercase type', () => {
    expect(statisticIconKey('damage', 'MAGIC')).toBe('icon.damage.magic');
  });

  it('slotMarkKey uses the lowercase combatant', () => {
    expect(slotMarkKey('LEADER')).toBe('slot.leader');
  });

  describe('in the domain', () => {
    it('Card.getImage uses the image key', () => {
      expect(createCard('WARRIOR', '4', 'RARE').getImage()).toBe('warrior.rare.4');
    });

    it('Card.getTexture uses the frame key', () => {
      expect(createCard('LEADER', '0').getTexture()).toBe('frame.leader');
    });

    it('Card.getAudio of a put uses the audio key', () => {
      expect(createCard('WARRIOR', '4', 'RARE').getAudio('put')).toBe('warrior.rare.4.put');
    });

    it('Card.getAudio of an attack picks one of the variants of the contract', () => {
      expect(createCard('WARRIOR', '4', 'RARE').getAudio('attack')).toMatch(/^warrior\.rare\.4\.attack\.[1-3]$/);
    });

    it('a damage icon uses the damage type', () => {
      expect(Damage('TRUE', 5).icon()).toBe('icon.damage.true');
    });

    it('an armor icon uses the armor type', () => {
      expect(Armor('PHYSICAL', 5).icon()).toBe('icon.armor.physical');
    });

    it('a health icon is the health key', () => {
      expect(Health(5, 10).icon()).toBe('icon.health');
    });

    it('ZoneSlot.getMaskTexture uses the slot mark of the allowed combatant', () => {
      expect(new ZoneSlot(new ZonePosition(0, 0), 'WARRIOR').getMaskTexture()).toBe('slot.warrior');
    });
  });
});
