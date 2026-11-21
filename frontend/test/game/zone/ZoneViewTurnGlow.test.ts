import 'phaser';
import { describe, expect, it, vi } from 'vitest';
import ZoneView from '@/game/zone/ZoneView';
import { ELIMINATED_LABEL_OUTLINE_FRACTION, ELIMINATED_LABEL_SIZE } from '@/core/Constants';
import { paletteText } from '@/game/utils/Palette';

/** Runs the private glow of a zone with the pieces it reads, without building a Phaser container. */
function showTurnGlow(leaderCombatant: object | null) {
  const leaderSlotView = { showTurnGlow: vi.fn() };
  const leaderSlot = { allowedCombatant: 'LEADER', combatant: leaderCombatant, position: { row: 0, column: 0 } };
  const zoneView = {
    zone: { slots: [[leaderSlot]] },
    getSlotAt: () => leaderSlotView
  };

  (ZoneView.prototype as unknown as { showTurnGlow(): void }).showTurnGlow.call(zoneView);

  return leaderSlotView.showTurnGlow;
}

describe('ZoneView turn glow', () => {
  // VIEW-20
  it('frames the leader of the player with the turn', () => {
    const glow = showTurnGlow({});

    expect(glow).toHaveBeenCalledOnce();
  });

  // CON-32
  it('lights nothing when the leader of the player with the turn is already dead', () => {
    const glow = showTurnGlow(null);

    expect(glow).not.toHaveBeenCalled();
  });
});

describe('ZoneView eliminated mark', () => {
  const fakeLabel = () => ({ setOrigin: vi.fn(), setPosition: vi.fn(), setScale: vi.fn(), text: '' });

  /** A zone with the pieces `showEliminated` reads, without building a Phaser container. */
  function createZoneView(slotViews: object[], label: ReturnType<typeof fakeLabel>, text: object = vi.fn(() => label)) {
    return {
      slots: [slotViews],
      scene: { add: { text } },
      add: vi.fn(),
      eliminatedMarks: [] as unknown[],
      drawnCenter: () => ({ x: 7, y: 9 })
    };
  }

  const show = (zoneView: object) => (ZoneView.prototype as unknown as { showEliminated(): void }).showEliminated.call(zoneView);

  // VIEW-11
  it('covers every slot with a veil and labels the zone as eliminated', () => {
    const slotViews = [{ showEliminatedVeil: vi.fn(() => ({})) }, { showEliminatedVeil: vi.fn(() => ({})) }];
    const label = fakeLabel();
    const text = vi.fn((_x: number, _y: number, content: string) => Object.assign(label, { text: content }));

    show(createZoneView(slotViews, label, text));

    expect([slotViews.map((view) => view.showEliminatedVeil.mock.calls.length), label.text]).toEqual([[1, 1], 'Eliminado']);
  });

  // VIEW-11
  it('outlines the label in black as thick as 14% of its height, with no panel behind it', () => {
    const label = fakeLabel();
    const text = vi.fn(() => label);

    show(createZoneView([], label, text));

    expect(text).toHaveBeenCalledWith(0, 0, 'Eliminado', expect.objectContaining({
      stroke: paletteText('TEXT_OUTLINE'),
      strokeThickness: ELIMINATED_LABEL_SIZE * ELIMINATED_LABEL_OUTLINE_FRACTION
    }));
  });

  // VIEW-11
  it('centers the label on the zone as drawn', () => {
    const label = fakeLabel();

    show(createZoneView([], label));

    expect(label.setPosition).toHaveBeenCalledWith(7, 9);
  });

  // VIEW-11
  it('keeps the veils and the label to fade them in', () => {
    const veil = {};
    const zoneView = createZoneView([{ showEliminatedVeil: () => veil }], fakeLabel());

    show(zoneView);

    expect(zoneView.eliminatedMarks).toHaveLength(2);
    expect(zoneView.eliminatedMarks[0]).toBe(veil);
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
