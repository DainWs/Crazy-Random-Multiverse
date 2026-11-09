import 'phaser';
import { describe, expect, it, vi } from 'vitest';
import ZoneView from '@/game/zone/ZoneView';
import ZoneSlotLayout from '@/game/zone/ZoneSlotLayout';
import { TURN_GLOW_LAYERS } from '@/core/Constants';

const corner = (x: number, y: number) => ({ x, y, z: 0, scale: 1 });
const corners = { tl: corner(-30, -40), tr: corner(30, -40), bl: corner(-30, 40), br: corner(30, 40) };

/** Runs the private glow of a zone with the pieces it reads, without building a Phaser container. */
function showTurnGlow(leaderCombatant: object | null) {
  const leaderSlotView = { corners, showTurnGlow: vi.fn() };
  const leaderSlot = { allowedCombatant: 'LEADER', combatant: leaderCombatant, position: { row: 0, column: 0 } };
  const zoneView = {
    zone: { slots: [[leaderSlot]] },
    slotLayout: new ZoneSlotLayout({ position: { x: 0, y: 0 }, rotation: 0, slotSize: { width: 60, height: 80 }, spaceBetweenSlots: 0 }),
    getSlotAt: () => leaderSlotView
  };

  (ZoneView.prototype as unknown as { showTurnGlow(): void }).showTurnGlow.call(zoneView);

  return leaderSlotView.showTurnGlow;
}

describe('ZoneView turn glow', () => {
  // VIEW-20
  it('lights the leader of the player with the turn with one outline per layer', () => {
    const glow = showTurnGlow({});

    expect(glow.mock.calls[0][0]).toHaveLength(TURN_GLOW_LAYERS);
  });

  // CON-32
  it('lights nothing when the leader of the player with the turn is already dead', () => {
    const glow = showTurnGlow(null);

    expect(glow).not.toHaveBeenCalled();
  });
});
