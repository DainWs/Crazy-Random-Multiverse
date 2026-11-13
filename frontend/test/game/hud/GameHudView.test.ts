import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import GameHudView from '@/game/hud/GameHudView';
import type { GameScene } from '@/scenes/Game';
import { HUD_MARGIN } from '@/core/Constants';

const store = vi.hoisted(() => ({
  round: 2 as number | undefined,
  playerWithTurn: undefined as { code: string; name: string } | undefined,
  spectator: false
}));

vi.mock('@/core/StoreSystem', () => ({
  default: {
    getRound: () => store.round,
    getPlayer: () => ({ code: 'p1', name: 'One' }),
    getPlayerWithTurn: () => store.playerWithTurn,
    isPlayerSpectator: () => store.spectator
  }
}));

/** A text that keeps what it shows and its listeners, so the tests check the screen and not the calls. */
class FakeText {
  public text = '';
  public color = '';
  public background = '';
  public alpha = 1;
  public visible = true;
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
  public setVisible(visible: boolean) { this.visible = visible; return this; }
  public setBackgroundColor(background: string) { this.background = background; return this; }
  public setPadding() { return this; }
  public setOrigin() { return this; }
  public scale = 1;
  public setScrollFactor() { return this; }
  public setDepth() { return this; }
  public setScale(scale: number) { this.scale = scale; return this; }
  public setPosition(x: number, y: number) { this.x = x; this.y = y; return this; }
  public setInteractive() { return this; }
  public on(event: string, listener: () => void) { this.listeners.set(event, listener); return this; }
  public destroy() { this.destroyed = true; }
  public click() { this.listeners.get('pointerup')?.(); }
  public hover() { this.listeners.get('pointerover')?.(); }
  public unhover() { this.listeners.get('pointerout')?.(); }
}

class FakeShape {
  public setStrokeStyle() { return this; }
  public setOrigin() { return this; }
  public setInteractive() { return this; }
}

class FakeContainer {
  public destroyed = false;
  public constructor(public children: unknown[]) {}
  public setScrollFactor() { return this; }
  public setDepth() { return this; }
  public scale = 1;
  public x = 0;
  public y = 0;
  public setScale(scale: number) { this.scale = scale; return this; }
  public setPosition(x: number, y: number) { this.x = x; this.y = y; return this; }
  public destroy() { this.destroyed = true; }
}

describe('GameHudView', () => {
  let texts: FakeText[];
  let containers: FakeContainer[];
  let onPassTurn: Mock<() => void>;
  let onSurrender: Mock<() => void>;
  let onLeave: Mock<() => void>;
  let hud: GameHudView;
  let zoom: number;
  let screen: { width: number; height: number };
  let prerender: (() => void) | undefined;

  const turnText = () => texts[0];
  const passTurnButton = () => texts[1];
  const surrenderButton = () => texts[2];
  const leaveButton = () => texts[3];
  const spectatorLabel = () => texts[4];
  const dialogButton = (label: string) => texts.find((text) => text.text === label)!;

  beforeEach(() => {
    texts = [];
    containers = [];
    store.round = 2;
    store.playerWithTurn = undefined;
    store.spectator = false;
    onPassTurn = vi.fn<() => void>();
    onSurrender = vi.fn<() => void>();
    onLeave = vi.fn<() => void>();
    zoom = 1;
    screen = { width: 1000, height: 800 };
    prerender = undefined;
    const scene = {
      scale: screen,
      cameraSystem: { getCamera: () => ({ zoom }) },
      events: {
        on: (_event: string, listener: () => void) => { prerender = listener; },
        off: () => { prerender = undefined; }
      },
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
    hud = new GameHudView(scene, { onPassTurn, onSurrender, onLeave });
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

    // CON-32
    it('still shows the player with the turn when they have been eliminated', () => {
      store.playerWithTurn = { code: 'p3', name: 'Dead', isAlive: false } as { code: string; name: string };

      hud.refresh(false);

      expect(turnText().text).toBe('Ronda 2 · Turno de Dead');
    });

    it('shows only whose turn it is before the first round', () => {
      store.round = undefined;
      store.playerWithTurn = { code: 'p2', name: 'Two' };

      hud.refresh(false);

      expect(turnText().text).toBe('Turno de Two');
    });
  });

  // UI-3
  describe('zoom', () => {
    it('scales the HUD against the zoom of the camera', () => {
      zoom = 2;

      prerender?.();

      expect([turnText().scale, passTurnButton().scale, surrenderButton().scale]).toEqual([0.5, 0.5, 0.5]);
    });

    it('moves the turn text so that it keeps its place on the screen', () => {
      zoom = 2;

      prerender?.();

      // center + (24 - center) / 2
      expect([turnText().x, turnText().y]).toEqual([250 + 12, 200 + 12]);
    });

    it('keeps the HUD as it is while the zoom does not change', () => {
      const before = [turnText().x, turnText().y, turnText().scale];

      prerender?.();

      expect([turnText().x, turnText().y, turnText().scale]).toEqual(before);
    });

    it('draws the dialog against the zoom of the camera', () => {
      hud.refresh(true);
      surrenderButton().click();
      zoom = 2;

      prerender?.();

      expect([containers[0].scale, containers[0].x, containers[0].y]).toEqual([0.5, 250, 200]);
    });

    it('stops following the zoom when it is destroyed', () => {
      hud.destroy();

      expect(prerender).toBeUndefined();
    });
  });

  // VIEW-24
  describe('window size', () => {
    it('keeps the buttons at the corner of a resized window', () => {
      screen.width = 1400;
      screen.height = 600;

      prerender?.();

      // the corner of the window minus the margin
      expect([passTurnButton().x, passTurnButton().y]).toEqual([1400 - HUD_MARGIN, 600 - HUD_MARGIN]);
    });

    it('closes the dialog when the window changes size', () => {
      hud.refresh(true);
      surrenderButton().click();
      screen.width = 1400;

      prerender?.();

      expect(containers[0].destroyed).toBe(true);
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

  // UI-8, UI-15, SPEC-3
  describe('spectator', () => {
    beforeEach(() => {
      store.spectator = true;
      hud.refresh(false);
    });

    it('hides the buttons to pass the turn and to surrender', () => {
      expect([passTurnButton().visible, surrenderButton().visible]).toEqual([false, false]);
    });

    it('shows the button to leave', () => {
      expect(leaveButton().visible).toBe(true);
    });

    // VIEW-28
    it('shows that they are only watching', () => {
      expect([spectatorLabel().visible, spectatorLabel().text]).toEqual([true, 'Estás observando la partida']);
    });

    it('asks for confirmation instead of leaving at once', () => {
      leaveButton().click();

      expect([containers.length, onLeave.mock.calls.length]).toEqual([1, 0]);
    });

    it('leaves when the player confirms', () => {
      leaveButton().click();

      dialogButton('Sí').click();

      expect(onLeave).toHaveBeenCalledTimes(1);
    });

    it('keeps the dialog open while the player cannot act', () => {
      leaveButton().click();

      hud.refresh(false);

      expect(containers[0].destroyed).toBe(false);
    });
  });

  // VIEW-28
  it('does not show the spectator label to a player', () => {
    hud.refresh(true);

    expect(spectatorLabel().visible).toBe(false);
  });

  it('lights a button under the pointer and restores it when the pointer leaves', () => {
    passTurnButton().hover();
    const hovered = passTurnButton().background;
    passTurnButton().unhover();

    expect([hovered, passTurnButton().background]).toEqual(['#46627f', '#34495e']);
  });

  // UI-8
  it('shows only the buttons of a player while they have not been eliminated', () => {
    hud.refresh(true);

    expect([passTurnButton().visible, surrenderButton().visible, leaveButton().visible]).toEqual([true, true, false]);
  });
});
