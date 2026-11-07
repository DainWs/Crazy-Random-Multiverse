import { describe, expect, it } from 'vitest';
import { toCard, type CardDto } from '@/api/dtos/CardDto';

const createWarriorDto = (overrides: Partial<CardDto> = {}): CardDto => ({
  catalogCode: { code: '2', type: 'WARRIOR' },
  name: 'card.warrior.2.name',
  description: 'card.warrior.2.description',
  type: 'WARRIOR',
  rarity: 'UNCOMMON',
  damage: 20,
  damageType: 'PHYSICAL',
  health: 10,
  maxHealth: 10,
  ...overrides
});

const createEquipmentDto = (overrides: Partial<CardDto> = {}): CardDto => ({
  catalogCode: { code: '0', type: 'EQUIPMENT' },
  name: 'card.equipment.0.name',
  description: 'card.equipment.0.description',
  type: 'EQUIPMENT',
  damage: 15,
  damageType: 'PHYSICAL',
  ...overrides
});

describe('Card', () => {
  describe('getEquipmentValue', () => {
    // CON-8
    it('returns undefined for a statistic the equipment does not send', () => {
      const card = toCard(createWarriorDto({ equipment: [createEquipmentDto()] }));

      expect(card.getEquipmentValue('Health')).toBeUndefined();
    });

    it('returns the value the equipment adds', () => {
      const card = toCard(createWarriorDto({ equipment: [createEquipmentDto()] }));

      expect(card.getEquipmentValue('Damage')).toBe(15);
    });

    it('returns undefined for a card without equipment', () => {
      const card = toCard(createWarriorDto());

      expect(card.getEquipmentValue('Damage')).toBeUndefined();
    });

    // EQUIP-4
    it('returns the total the pieces add', () => {
      const card = toCard(createWarriorDto({ equipment: [createEquipmentDto(), createEquipmentDto()] }));

      expect(card.getEquipmentValue('Damage')).toBe(30);
    });
  });

  describe('equipment', () => {
    // EQUIP-4
    it('holds every piece the server sends', () => {
      const card = toCard(createWarriorDto({ equipment: [createEquipmentDto(), createEquipmentDto()] }));

      expect(card.equipment).toHaveLength(2);
    });

    it('is empty for a card without equipment', () => {
      expect(toCard(createWarriorDto()).equipment).toEqual([]);
    });
  });
});
