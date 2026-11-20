import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import GameHudView from '@/game/hud/GameHudView';
import type { GameScene } from '@/scenes/Game';
import { HUD_MARGIN, RENDER_SCALE } from '@/core/Constants';

const store = vi.hoisted(() => ({
  round: 2 as number | undefined,
  playerWithTurn: undefined as { code: string; name: string } | undefined,
  spectator: false
}));

const session = vi.hoisted(() => ({ connectionNotice: undefined as string | undefined }));

vi.mock('@/core/SessionSystem', () => ({
  default: { connectionNoticeKey: { get value() { return session.connectionNotice; } } }
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
  public width = 100;
  public y: number;
  public destroyed = false;
  private readonly listeners = new Map<string, (() => void)[]>();

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
  public on(event: string, listener: () => void) { this.listeners.set(event, [...(this.listeners.get(event) ?? []), listener]); return this; }
  public destroy() { this.destroyed = true; }
  public click() { this.listeners.get('pointerup')?.forEach((listener) => listener()); }
  public hover() { this.listeners.get('pointerover')?.forEach((listener) => listener()); }
  public unhover() { this.listeners.get('pointerout')?.forEach((listener) => listener()); }
}

class FakeShape {
  public x = 0;
  public y = 0;
  public width = 0;
  public height = 0;
  public setStrokeStyle() { return this; }
  public setPosition(x: number, y: number) { this.x = x; this.y = y; return this; }
  public setSize(width: number, height: number) { this.width = width; this.height = height; return this; }
  public scale = 1;
  public setOrigin() { return this; }
  public setScale(scale: number) { this.scale = scale; return this; }
  public setScrollFactor() { return this; }
  public setDepth() { return this; }
  public setInteractive() { return this; }
  public destroy() { /* nothing to release */ }
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
  let keydown: ((event: unknown) => void) | undefined;
  let shapes: FakeShape[];
  let clock: number;

  const turnPanel = () => shapes[0];
  const turnText = () => texts[0];
  const passTurnButton = () => texts[1];
  const surrenderButton = () => texts[2];
  const leaveButton = () => texts[3];
  const spectatorLabel = () => texts[4];
  const dialogButton = (label: string) => texts.find((text) => text.text === label)!;
  const press = (code: string, repeat = false) => {
    const event = { code, repeat, preventDefault: vi.fn() };
    keydown?.(event);

    return event;
  };
  const focusFrame = () => shapes[shapes.length - 1];

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
    keydown = undefined;
    shapes = [];
    clock = 0;
    session.connectionNotice = undefined;
    const scene = {
      scale: screen,
      time: { get now() { return clock; } },
      cameraSystem: { getCamera: () => ({ zoom }) },
      input: {
        keyboard: {
          on: (_event: string, listener: (event: unknown) => void, context: object) => { keydown = listener.bind(context); },
          off: () => { keydown = undefined; }
        }
      },
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
        rectangle: () => {
          const fake = new FakeShape();
          shapes.push(fake);
          return fake;
        },
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
    // VIEW-44
    it('draws the round and the turn on a panel as big as the text, at its place', () => {
      hud.refresh(false);

      expect([turnPanel().width, turnPanel().height, turnPanel().x, turnPanel().y]).toEqual([turnText().width, turnText().height, turnText().x, turnText().y]);
    });

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

      expect([turnPanel().scale, turnText().scale, passTurnButton().scale, surrenderButton().scale]).toEqual([RENDER_SCALE / 2, RENDER_SCALE / 2, RENDER_SCALE / 2, RENDER_SCALE / 2]);
    });

    it('moves the turn text so that it keeps its place on the screen', () => {
      zoom = 2;

      prerender?.();

      // center + (the margin in the pixels of the canvas - center) / 2
      expect([turnText().x, turnText().y]).toEqual([250 + (HUD_MARGIN * RENDER_SCALE) / 2, 200 + (HUD_MARGIN * RENDER_SCALE) / 2]);
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

      expect([containers[0].scale, containers[0].x, containers[0].y]).toEqual([RENDER_SCALE / 2, 250, 200]);
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

      // the corner of the window minus the margin, in the pixels of the canvas
      expect([passTurnButton().x, passTurnButton().y]).toEqual([1400 - HUD_MARGIN * RENDER_SCALE, 600 - HUD_MARGIN * RENDER_SCALE]);
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

  // UI-32
  describe('end turn key', () => {
    it('passes the turn when the player can act', () => {
      hud.refresh(true);

      press('Space');

      expect(onPassTurn).toHaveBeenCalledTimes(1);
    });

    it('does nothing while the button is disabled', () => {
      hud.refresh(false);

      press('Space');

      expect(onPassTurn).not.toHaveBeenCalled();
    });

    it('does nothing while the key repeats', () => {
      hud.refresh(true);

      press('Space', true);

      expect(onPassTurn).not.toHaveBeenCalled();
    });

    it('does nothing while the confirmation dialog is open', () => {
      hud.refresh(true);
      surrenderButton().click();

      press('Space');

      expect(onPassTurn).not.toHaveBeenCalled();
    });

    it('does nothing while the notice of the connection is shown', () => {
      hud.refresh(true);
      session.connectionNotice = 'ui.notice.connection_lost';

      press('Space');

      expect(onPassTurn).not.toHaveBeenCalled();
    });

    it('does nothing for a spectator', () => {
      store.spectator = true;
      hud.refresh(true);

      press('Space');

      expect(onPassTurn).not.toHaveBeenCalled();
    });

    it('prevents the scroll of the page', () => {
      hud.refresh(true);

      expect(press('Space').preventDefault).toHaveBeenCalled();
    });

    it('ignores the other keys', () => {
      hud.refresh(true);

      press('Enter');

      expect(onPassTurn).not.toHaveBeenCalled();
    });

    it('stops listening when the HUD is destroyed', () => {
      hud.destroy();

      expect(keydown).toBeUndefined();
    });
  });

  // UI-32, VIEW-42
  describe('keyboard in the confirmation dialog', () => {
    beforeEach(() => {
      hud.refresh(true);
      surrenderButton().click();
    });

    it('puts the focus frame on the button to decline when it opens', () => {
      const no = dialogButton('No');

      expect([focusFrame().x, focusFrame().y, focusFrame().width, focusFrame().height]).toEqual([no.x, no.y, 108, 38]);
    });

    it('closes the dialog without surrendering on Enter', () => {
      press('Enter');

      expect([containers[0].destroyed, onSurrender.mock.calls.length]).toEqual([true, 0]);
    });

    it('moves the focus frame to the button to confirm on Tab', () => {
      press('Tab');

      expect(focusFrame().x).toBe(dialogButton('Sí').x);
    });

    it('handles the same event of the browser once', () => {
      const event = { code: 'Tab', repeat: false, preventDefault: vi.fn() };

      keydown?.(event);
      keydown?.(event);

      expect(focusFrame().x).toBe(dialogButton('Sí').x);
    });

    it('moves the focus back to the button to decline on a second Tab', () => {
      press('Tab');
      press('Tab');

      expect(focusFrame().x).toBe(dialogButton('No').x);
    });

    it.each([{ code: 'ArrowLeft' }, { code: 'ArrowRight' }])('moves the focus on $code', ({ code }) => {
      press(code);

      expect(focusFrame().x).toBe(dialogButton('Sí').x);
    });

    it('surrenders on Enter after moving the focus to the button to confirm', () => {
      press('Tab');

      press('Enter');

      expect(onSurrender).toHaveBeenCalledTimes(1);
    });

    it('closes the dialog without surrendering on Escape with the focus on the button to confirm', () => {
      press('Tab');

      press('Escape');

      expect([containers[0].destroyed, onSurrender.mock.calls.length]).toEqual([true, 0]);
    });

    it('does nothing on other keys', () => {
      press('KeyA');

      expect([containers[0].destroyed, onSurrender.mock.calls.length]).toEqual([false, 0]);
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

  // VIEW-38
  describe('pulse of the end turn button', () => {
    const REST = '#1a5fa8';
    const HIGH = '#487fb9';
    const HOVER = '#2674c4';

    it('does not pulse while something is left to do', () => {
      hud.refresh(true, false);

      expect(passTurnButton().background).toBe(REST);
    });

    it('mixes its background with white at the top of the wave', () => {
      clock = 400;

      hud.refresh(true, true);

      expect(passTurnButton().background).toBe(HIGH);
    });

    it('goes back to its color at the bottom of the wave', () => {
      clock = 1200;

      hud.refresh(true, true);

      expect(passTurnButton().background).toBe(REST);
    });

    it('repeats the wave every 1600 ms', () => {
      clock = 400 + 1600;

      hud.refresh(true, true);

      expect(passTurnButton().background).toBe(HIGH);
    });

    it('leaves the text as it is', () => {
      clock = 400;

      hud.refresh(true, true);

      expect(passTurnButton().color).toBe('');
    });

    it('stops and restores its color when something is left to do again', () => {
      clock = 400;
      hud.refresh(true, true);

      hud.refresh(true, false);

      expect(passTurnButton().background).toBe(REST);
    });

    it('shows the background of the pointer instead of the pulse while the pointer is over it', () => {
      clock = 400;
      passTurnButton().hover();

      hud.refresh(true, true);

      expect(passTurnButton().background).toBe(HOVER);
    });

    it('goes on with the pulse from the clock when the pointer leaves', () => {
      passTurnButton().hover();
      hud.refresh(true, true);
      passTurnButton().unhover();
      clock = 400;

      hud.refresh(true, true);

      expect(passTurnButton().background).toBe(HIGH);
    });

    // UI-30
    it('does not pulse when the operating system asks for reduced motion', () => {
      vi.stubGlobal('matchMedia', () => ({ matches: true }));
      clock = 400;

      hud.refresh(true, true);
      vi.unstubAllGlobals();

      expect(passTurnButton().background).toBe(REST);
    });
  });

  it('lights a button under the pointer and restores it when the pointer leaves', () => {
    passTurnButton().hover();
    const hovered = passTurnButton().background;
    passTurnButton().unhover();

    expect([hovered, passTurnButton().background]).toEqual(['#2674c4', '#1a5fa8']);
  });

  // UI-8
  it('shows only the buttons of a player while they have not been eliminated', () => {
    hud.refresh(true);

    expect([passTurnButton().visible, surrenderButton().visible, leaveButton().visible]).toEqual([true, true, false]);
  });
});
