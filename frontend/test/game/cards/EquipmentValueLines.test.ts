import { describe, expect, it } from 'vitest';
import Card, { CardCode } from '@/domain/Card';
import { Bonus } from '@/domain/Statistics';
import { equipmentValueLines } from '@/game/cards/EquipmentValueLines';

describe('EquipmentValueLines', () => {
  const createPiece = (): Card => {
    return new Card({ code: new CardCode('0', 'EQUIPMENT'), name: 'card.equipment.0.name', description: '', type: 'EQUIPMENT' });
  };

  // EQUIP-1, VIEW-14
  it('lists a gain with a plus sign', () => {
    const piece = createPiece();
    piece.damage = Bonus('Damage', 15);

    expect(equipmentValueLines(piece)).toEqual([{ value: 15, text: 'Daño: +15' }]);
  });

  it('lists a penalty with a minus sign', () => {
    const piece = createPiece();
    piece.health = Bonus('Health', -5);

    expect(equipmentValueLines(piece)).toEqual([{ value: -5, text: 'Vida: -5' }]);
  });

  it('lists damage, armor and health in that order', () => {
    const piece = createPiece();
    piece.health = Bonus('Health', 2);
    piece.armor = Bonus('Armor', 3);
    piece.damage = Bonus('Damage', 1);

    const texts: string[] = equipmentValueLines(piece).map((line) => line.text);

    expect(texts).toEqual(['Daño: +1', 'Armadura: +3', 'Vida: +2']);
  });

  it('lists nothing for a piece without values', () => {
    expect(equipmentValueLines(createPiece())).toEqual([]);
  });
});
