import 'phaser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ZoneSlotView from '@/game/zone/ZoneSlotView';
import { OWN_SLOT_BORDER_COLOR, OWN_SLOT_COLOR } from '@/core/Constants';
import Player from '@/domain/Player';

const localPlayer = new Player('p-1', 'One');
const getPlayer = vi.hoisted(() => vi.fn());

vi.mock('@/core/StoreSystem', () => ({ default: { getPlayer } }));

/** Runs the private background of a slot with the pieces it reads, without building a Phaser container. */
function restoreBackgroundOf(owner: Player) {
  const setBackgroundColor = vi.fn();
  const slotView = { zone: { isPlayerOwner: (player: Player) => player.code === owner.code }, setBackgroundColor };

  (ZoneSlotView.prototype as unknown as { restoreBackground(): void }).restoreBackground.call(slotView);

  return setBackgroundColor;
}

describe('ZoneSlotView background', () => {
  beforeEach(() => {
    getPlayer.mockReturnValue(localPlayer);
  });

  // VIEW-27
  it('tints the slots of the zone of the local player', () => {
    expect(restoreBackgroundOf(localPlayer)).toHaveBeenCalledWith(OWN_SLOT_COLOR, OWN_SLOT_BORDER_COLOR);
  });

  // VIEW-27
  it('leaves the slots of the zone of a rival white', () => {
    expect(restoreBackgroundOf(new Player('p-2', 'Two'))).toHaveBeenCalledWith(0xffffff);
  });
});
