import 'phaser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ZoneSlotView from '@/game/zone/ZoneSlotView';
import { paletteFill } from '@/game/utils/Palette';
import Player from '@/domain/Player';

const localPlayer = new Player('p-1', 'One');
const getPlayer = vi.hoisted(() => vi.fn());

vi.mock('@/core/StoreSystem', () => ({ default: { getPlayer } }));

/** Runs the private background of a slot with the pieces it reads, without building a Phaser container. */
function restoreBackgroundOf(owner: Player) {
  const setBackgroundColor = vi.fn();
  const showOwnZoneLines = vi.fn();
  const zone = { isPlayerOwner: (player: Player) => player.code === owner.code };
  const slotView = { zone, setBackgroundColor, showOwnZoneLines };

  (ZoneSlotView.prototype as unknown as { restoreBackground(): void }).restoreBackground.call(slotView);

  return { setBackgroundColor, showOwnZoneLines };
}

describe('ZoneSlotView background', () => {
  beforeEach(() => {
    getPlayer.mockReturnValue(localPlayer);
  });

  // VIEW-27
  it('tints the slots of the zone of the local player', () => {
    expect(restoreBackgroundOf(localPlayer).setBackgroundColor).toHaveBeenCalledWith(paletteFill('SLOT_OWN_TINT'), paletteFill('SLOT_OWN_BORDER'));
  });

  // VIEW-27
  it('leaves the slots of the zone of a rival white', () => {
    expect(restoreBackgroundOf(new Player('p-2', 'Two')).setBackgroundColor).toHaveBeenCalledWith(0xffffff);
  });

  // VIEW-39
  it('asks for the diagonal lines in the zone of the local player', () => {
    expect(restoreBackgroundOf(localPlayer).showOwnZoneLines).toHaveBeenCalled();
  });

  // VIEW-39
  it('asks for no diagonal lines in the zone of a rival', () => {
    expect(restoreBackgroundOf(new Player('p-2', 'Two')).showOwnZoneLines).not.toHaveBeenCalled();
  });
});
