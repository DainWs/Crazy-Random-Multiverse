import { describe, expect, it } from 'vitest';
import { damageIconOutline } from '@/game/cards/DamageIcons';
import type { DamageIcon } from '@/game/cards/DamageIcons';

// VIEW-6
describe('damageIconOutline', () => {
  const icons: DamageIcon[] = ['HEART', 'SHIELD', 'MAGIC_SHIELD', 'SWORD'];

  it.each(icons)('keeps the %s inside a square as tall as the text', (icon) => {
    const points = damageIconOutline(icon, 40);

    expect(points.every(({ x, y }) => Math.abs(x) <= 20 && Math.abs(y) <= 20)).toBe(true);
  });

  it('gives the shield of magic armor another shape than the physical one', () => {
    expect(damageIconOutline('MAGIC_SHIELD', 40)).not.toEqual(damageIconOutline('SHIELD', 40));
  });

  it('scales with the size', () => {
    expect(damageIconOutline('SHIELD', 80)[1].x).toBe(2 * damageIconOutline('SHIELD', 40)[1].x);
  });
});
