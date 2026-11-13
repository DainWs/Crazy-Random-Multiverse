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

describe('ZoneView eliminated mark', () => {
  // VIEW-11
  it('covers every slot with a veil and labels the zone as eliminated', () => {
    const slotViews = [{ showEliminatedVeil: vi.fn() }, { showEliminatedVeil: vi.fn() }];
    const label = { setOrigin: vi.fn(), setScale: vi.fn(), text: '' };
    const zoneView = {
      slots: [slotViews],
      options: { position: { x: 0, y: 0 } },
      scene: { add: { text: (_x: number, _y: number, text: string) => Object.assign(label, { text }) } },
      add: vi.fn()
    };

    (ZoneView.prototype as unknown as { showEliminated(): void }).showEliminated.call(zoneView);

    expect([slotViews.map((view) => view.showEliminatedVeil.mock.calls.length), label.text]).toEqual([[1, 1], 'Eliminado']);
  });
});

describe('ZoneView attack ready marks', () => {
  /** Runs the private marks of a zone over slots whose cards can or cannot attack. */
  function showAttackReadyMarks(attackAvailable: Array<boolean | null>) {
    const slotViews = attackAvailable.map(() => ({ showReadyMark: vi.fn() }));
    const slots = attackAvailable.map((available, column) => ({
      position: { row: 0, column },
      combatant: available === null ? null : { isAttackAvailable: available }
    }));
    const zoneView = { zone: { slots: [slots] }, getSlotAt: (position: { column: number }) => slotViews[position.column] };

    (ZoneView.prototype as unknown as { showAttackReadyMarks(): void }).showAttackReadyMarks.call(zoneView);

    return slotViews.map((view) => view.showReadyMark.mock.calls.length);
  }

  // VIEW-17
  it('marks only the cards that can attack', () => {
    expect(showAttackReadyMarks([true, false, null, true])).toEqual([1, 0, 0, 1]);
  });
});
