import 'phaser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GlobalCardTooltipView from '@/game/cards/tooltip/GlobalCardTooltipView';
import { TOOLTIP_CLOSE_WAIT_MS } from '@/core/Constants';
import ZoneSlotView from '@/game/zone/ZoneSlotView';

type Timer = { remove: ReturnType<typeof vi.fn> };
type Tween = { targets: { open: number }; open: number; duration: number; ease: string; onUpdate: () => void; onComplete: () => void };

/** Runs the methods of the panel that open and close it, over the pieces they read, without building a Phaser container. */
const panel = GlobalCardTooltipView.prototype as unknown as Record<string, (...args: unknown[]) => unknown>;

// VIEW-14
describe('GlobalCardTooltipView open and close', () => {
  let tooltip: Record<string, unknown> & { opening: { open: number }; closing: boolean; visible: boolean };
  let timers: Array<{ delay: number; callback: () => void; timer: Timer }>;
  let tweens: Tween[];

  const call = (name: string, ...args: unknown[]) => panel[name].call(tooltip, ...args);

  beforeEach(() => {
    timers = [];
    tweens = [];
    tooltip = {
      opening: { open: 1 },
      closing: false,
      visible: true,
      shownCardView: {},
      closeTimer: undefined,
      cardContainer: { removeAll: vi.fn() },
      setVisible: vi.fn(function (this: { visible: boolean }, visible: boolean) { this.visible = visible; }),
      setAlpha: vi.fn(),
      updateBounds: vi.fn(),
      scene: {
        events: { once: vi.fn(), off: vi.fn() },
        time: {
          delayedCall: (delay: number, callback: () => void) => {
            const timer = { remove: vi.fn() };
            timers.push({ delay, callback, timer });
            return timer;
          }
        },
        tweens: { add: (tween: Tween) => tweens.push(tween), killTweensOf: vi.fn() }
      }
    };
    for (const name of ['setOpen', 'animateOpen', 'finishClosing', 'cancelClose', 'close']) {
      tooltip[name] = (...args: unknown[]) => call(name, ...args);
    }
  });

  it('waits 150 ms after the pointer leaves the card before it closes', () => {
    call('hide');

    expect(timers.map(({ delay }) => delay)).toEqual([TOOLTIP_CLOSE_WAIT_MS]);
    expect(tweens).toHaveLength(0);
  });

  it('closes in 250 ms, speeding up, when the wait ends', () => {
    call('hide');

    timers[0].callback();

    expect(tweens[0]).toMatchObject({ open: 0, duration: 250, ease: 'Quad.easeIn' });
  });

  it('closes without the wait when the card is gone or a drag starts', () => {
    call('close');

    expect(timers).toHaveLength(0);
    expect(tweens[0]).toMatchObject({ open: 0, duration: 250 });
  });

  it('is removed when it has closed', () => {
    call('close');
    tooltip.opening.open = 0;

    tweens[0].onComplete();

    return Promise.resolve().then(() => {
      expect([tooltip.visible, tooltip.shownCardView]).toEqual([false, undefined]);
    });
  });

  it('does not wait again for a pointer that leaves while it is already closing', () => {
    call('close');

    call('hide');

    expect(timers).toHaveLength(0);
  });

  it('does nothing when it is already closed', () => {
    tooltip.visible = false;

    call('hide');

    expect(timers).toHaveLength(0);
  });

  it('opens in 250 ms, slowing down at the end', () => {
    call('animateOpen', 1);

    expect(tweens[0]).toMatchObject({ open: 1, duration: 250, ease: 'Power1' });
  });

  it('stays where it is when another card is entered while it waits to close', () => {
    call('hide');

    call('cancelClose');

    expect(timers[0].timer.remove).toHaveBeenCalled();
  });

  it('stops closing when another card is entered while it closes', () => {
    call('close');

    call('cancelClose');

    expect([tooltip.closing, (tooltip.scene as { tweens: { killTweensOf: unknown } }).tweens.killTweensOf]).toEqual([false, expect.anything()]);
  });

  it('is transparent in proportion to how closed it is', () => {
    call('setOpen', 0.25);

    expect(tooltip.setAlpha).toHaveBeenCalledWith(0.25);
  });
});

type FakeText = { visible: boolean; y: number; height: number };

function createFakeText(): FakeText {
  return {
    visible: true,
    y: 0,
    height: 20,
    setText: vi.fn(),
    setWordWrapWidth: vi.fn(),
    setVisible: vi.fn(function (this: FakeText, visible: boolean) { this.visible = visible; }),
    setPosition: vi.fn(function (this: FakeText, _x: number, y: number) { this.y = y; })
  } as FakeText;
}

/** A slot of the board; `ready` says whether it drew the cyan frame of its card on this board (VIEW-17). */
function createSlot(ready: boolean): ZoneSlotView {
  const slot = Object.create(ZoneSlotView.prototype) as ZoneSlotView;
  Object.assign(slot, { readyGraphics: ready ? {} : undefined });

  return slot;
}

// VIEW-59
describe('GlobalCardTooltipView attack line', () => {
  let tooltip: Record<string, unknown> & { canAttackText: FakeText };

  const describeCard = (parentContainer: unknown) => {
    const cardView = { card: { name: 'card.warrior.0.name', description: 'card.warrior.0.description', equipment: [] }, parentContainer };
    panel.buildDescription.call(tooltip, cardView);
  };

  beforeEach(() => {
    tooltip = {
      nameText: createFakeText(),
      canAttackText: createFakeText(),
      descriptionText: createFakeText(),
      equipmentTexts: [],
      currentWidth: 480,
      contentScale: 1
    } as unknown as Record<string, unknown> & { canAttackText: FakeText };
    for (const name of ['alignDescriptionText', 'clearEquipmentTexts']) {
      tooltip[name] = (...args: unknown[]) => panel[name].call(tooltip, ...args);
    }
  });

  it('shows the line for a card whose slot has the cyan frame', () => {
    describeCard(createSlot(true));

    expect(tooltip.canAttackText.visible).toBe(true);
  });

  it('hides the line for a card of the board that cannot attack', () => {
    describeCard(createSlot(false));

    expect(tooltip.canAttackText.visible).toBe(false);
  });

  it('hides the line for a card of the hand', () => {
    describeCard(undefined);

    expect(tooltip.canAttackText.visible).toBe(false);
  });

  it('puts the description right below the name without the line', () => {
    describeCard(createSlot(false));

    expect((tooltip.descriptionText as FakeText).y).toBe(50);
  });

  it('puts the description below the line when it is shown', () => {
    describeCard(createSlot(true));

    expect((tooltip.descriptionText as FakeText).y).toBe(80);
  });
});
