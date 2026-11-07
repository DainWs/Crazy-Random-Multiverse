import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import GameHudView from '@/game/hud/GameHudView';
import type { GameScene } from '@/scenes/Game';

const store = vi.hoisted(() => ({
  round: 2 as number | undefined,
  playerWithTurn: undefined as { code: string; name: string } | undefined
}));

vi.mock('@/core/StoreSystem', () => ({
  default: {
    getRound: () => store.round,
    getPlayer: () => ({ code: 'p1', name: 'One' }),
    getPlayerWithTurn: () => store.playerWithTurn
  }
}));

/** A text that keeps what it shows and its listeners, so the tests check the screen and not the calls. */
class FakeText {
  public text = '';
  public color = '';
  public alpha = 1;
  public height = 30;
  public y: number;
  public destroyed = false;
  private readonly listeners = new Map<string, () => void>();

  public constructor(public x: number, y: number, text: string | string[]) {
    this.y = y;
    this.setText(text);
  }

  public setText(text: string | string[]) { this.text = Array.isArray(text) ? text.join('\n') : text; return this; }
  public setColor(color: string) { this.color = color; return this; }
  public setAlpha(alpha: number) { this.alpha = alpha; return this; }
  public setOrigin() { return this; }
  public setScrollFactor() { return this; }
  public setDepth() { return this; }
  public setInteractive() { return this; }
  public on(event: string, listener: () => void) { this.listeners.set(event, listener); return this; }
  public destroy() { this.destroyed = true; }
  public click() { this.listeners.get('pointerup')?.(); }
}

class FakeShape {
  public setOrigin() { return this; }
  public setInteractive() { return this; }
}

class FakeContainer {
  public destroyed = false;
  public constructor(public children: unknown[]) {}
  public setScrollFactor() { return this; }
  public setDepth() { return this; }
  public destroy() { this.destroyed = true; }
}

describe('GameHudView', () => {
  let texts: FakeText[];
  let containers: FakeContainer[];
  let onPassTurn: Mock<() => void>;
  let onSurrender: Mock<() => void>;
  let hud: GameHudView;

  const turnText = () => texts[0];
  const passTurnButton = () => texts[1];
  const surrenderButton = () => texts[2];
  const dialogButton = (label: string) => texts.find((text) => text.text === label)!;

  beforeEach(() => {
    texts = [];
    containers = [];
    store.round = 2;
    store.playerWithTurn = undefined;
    onPassTurn = vi.fn<() => void>();
    onSurrender = vi.fn<() => void>();
    const scene = {
      scale: { width: 1000, height: 800 },
      add: {
        text: (x: number, y: number, text: string) => {
          const fake = new FakeText(x, y, text);
          texts.push(fake);
          return fake;
        },
        rectangle: () => new FakeShape(),
        container: (_x: number, _y: number, children: unknown[]) => {
          const fake = new FakeContainer(children);
          containers.push(fake);
          return fake;
        }
      }
    } as unknown as GameScene;
    hud = new GameHudView(scene, { onPassTurn, onSurrender });
  });

  // UI-3
  describe('turn indicator', () => {
    it('shows the round and that it is the turn of the local player', () => {
      store.playerWithTurn = { code: 'p1', name: 'One' };

      hud.refresh(true);

      expect(turnText().text).toBe('Ronda 2 · Tu turno');
    });

    it('shows the round and the name of the player with the turn', () => {
      store.playerWithTurn = { code: 'p2', name: 'Two' };

      hud.refresh(false);

      expect(turnText().text).toBe('Ronda 2 · Turno de Two');
    });

    it('shows only the round before the first turn', () => {
      hud.refresh(false);

      expect(turnText().text).toBe('Ronda 2');
    });
  });

  // UI-4
  describe('buttons', () => {
    it('ignores the clicks while the player cannot act', () => {
      hud.refresh(false);

      passTurnButton().click();

      expect(onPassTurn).not.toHaveBeenCalled();
    });

    it('dims the buttons while the player cannot act', () => {
      hud.refresh(true);
      hud.refresh(false);

      expect([passTurnButton().alpha, surrenderButton().alpha]).toEqual([0.4, 0.4]);
    });

    it('passes the turn when the player can act', () => {
      hud.refresh(true);

      passTurnButton().click();

      expect(onPassTurn).toHaveBeenCalledTimes(1);
    });
  });

  // UI-15
  describe('surrender', () => {
    beforeEach(() => {
      hud.refresh(true);
    });

    it('asks for confirmation instead of surrendering at once', () => {
      surrenderButton().click();

      expect([containers.length, onSurrender.mock.calls.length]).toEqual([1, 0]);
    });

    it('surrenders when the player confirms', () => {
      surrenderButton().click();

      dialogButton('Sí').click();

      expect(onSurrender).toHaveBeenCalledTimes(1);
    });

    it('closes the dialog without surrendering when the player declines', () => {
      surrenderButton().click();

      dialogButton('No').click();

      expect([containers[0].destroyed, onSurrender.mock.calls.length]).toEqual([true, 0]);
    });

    it('closes the dialog when the player loses the turn', () => {
      surrenderButton().click();

      hud.refresh(false);

      expect(containers[0].destroyed).toBe(true);
    });
  });
});
