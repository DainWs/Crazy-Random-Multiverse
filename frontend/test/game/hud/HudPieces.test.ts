import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as Constants from '@/core/Constants';
import type { HudSkin } from '@/game/hud/HudSkin';
import { accentAlpha, accentColor, buttonFill, createButton, createPanel, createText, panelBackground } from '@/game/hud/HudPieces';
import { DEFAULT_HUD_SKIN } from '@/game/hud/HudSkin';

type Listener = () => void;

type TweenConfig = { targets: object; value: number; duration: number; ease: string; onUpdate?: () => void; onComplete: () => void };

class FakeText {
  public background = '';
  public padding: unknown;
  public interactive: unknown;
  public readonly listeners = new Map<string, Listener>();

  public constructor(public x: number, public y: number, public text: string, public style: Record<string, string>) {}

  public setBackgroundColor(background: string) { this.background = background; return this; }
  public setPadding(padding: unknown) { this.padding = padding; return this; }
  public setInteractive(config: unknown) { this.interactive = config; return this; }
  public on(event: string, listener: Listener) { this.listeners.set(event, listener); return this; }
}

class FakeRectangle {
  public stroke: unknown[] | undefined;

  public constructor(public x: number, public y: number, public width: number, public height: number, public fill: number, public alpha: number) {}

  public setStrokeStyle(...stroke: unknown[]) { this.stroke = stroke; return this; }
}

// FX-17
describe('HudPieces', () => {
  let scene: Phaser.Scene;
  let tweens: TweenConfig[];

  /** A tween that ends at once at its final value, so what it leaves is what the button shows when the change is over. */
  const endAtOnce = (config: TweenConfig) => {
    tweens.push(config);
    (config.targets as { value: number }).value = config.value;
    config.onUpdate?.();
    config.onComplete();
  };

  beforeEach(() => {
    tweens = [];
    scene = {
      add: {
        text: (x: number, y: number, text: string, style: Record<string, string>) => new FakeText(x, y, text, style),
        rectangle: (...args: ConstructorParameters<typeof FakeRectangle>) => new FakeRectangle(...args)
      },
      events: { once: vi.fn(), off: vi.fn() },
      tweens: { add: endAtOnce, killTweensOf: vi.fn() }
    } as unknown as Phaser.Scene;
    vi.clearAllMocks();
  });

  describe('createText', () => {
    it('draws the text with the font, the size and the color of its level', () => {
      const text = createText(scene, 'TITLE', {}, 'Victoria') as unknown as FakeText;

      expect([text.text, text.style]).toEqual([
        'Victoria',
        { fontFamily: Constants.UI_FONT_FAMILY, fontSize: '40px', fontStyle: 'bold', resolution: Constants.RENDER_SCALE, color: '#ffffff' }
      ]);
    });

    it('takes the size and the color a view asks for instead of those of the level', () => {
      const text = createText(scene, 'BODY', { fontSize: '40px', color: 'REJECTION_TEXT' }) as unknown as FakeText;

      expect([text.style.fontSize, text.style.color]).toEqual(['40px', '#ff6b6b']);
    });

    it('leaves the text where Phaser creates it, for the layout to place', () => {
      const text = createText(scene, 'BODY') as unknown as FakeText;

      expect([text.x, text.y]).toEqual([0, 0]);
    });
  });

  describe('createButton', () => {
    it('draws the fill of the button and its label', () => {
      const button = createButton(scene, 'PRIMARY', 'Fin de turno') as unknown as FakeText;

      expect([button.text, button.background, button.interactive]).toEqual(['Fin de turno', '#1a5fa8', { useHandCursor: true }]);
    });

    // VIEW-43
    it('turns the surrender button red under the pointer', () => {
      const button = createButton(scene, 'DESTRUCTIVE', 'Rendirse') as unknown as FakeText;

      button.listeners.get('pointerover')!();

      expect([button.background, button.style.color]).toEqual(['#c0392b', '#ffffff']);
    });

    it('changes the fill under the pointer and back when it leaves', () => {
      const button = createButton(scene, 'NEUTRAL', 'No') as unknown as FakeText;

      button.listeners.get('pointerover')!();
      const underPointer = button.background;
      button.listeners.get('pointerout')!();

      expect([underPointer, button.background]).toEqual(['#46627f', '#34495e']);
    });

    // VIEW-28
    it('changes the fill under the pointer in 150 ms, slowing down at the end', () => {
      const button = createButton(scene, 'NEUTRAL', 'No') as unknown as FakeText;

      button.listeners.get('pointerover')!();

      expect(tweens[0]).toMatchObject({ value: 1, duration: 150, ease: 'Power1' });
    });

    // VIEW-28
    it('goes back in 150 ms when the pointer leaves', () => {
      const button = createButton(scene, 'NEUTRAL', 'No') as unknown as FakeText;
      button.listeners.get('pointerover')!();

      button.listeners.get('pointerout')!();

      expect(tweens[1]).toMatchObject({ value: 0, duration: 150, ease: 'Power1' });
    });

    // VIEW-28
    it('goes back from the fill it has reached when the pointer leaves before the change ends', () => {
      const button = createButton(scene, 'NEUTRAL', 'No') as unknown as FakeText;
      scene.tweens.add = vi.fn((config: TweenConfig) => {
        tweens.push(config);
        (config.targets as { value: number }).value = 0.5;
        config.onUpdate?.();
      }) as never;

      button.listeners.get('pointerover')!();
      const halfWay = button.background;
      button.listeners.get('pointerout')!();

      expect([halfWay, scene.tweens.killTweensOf]).toEqual(['#3d566f', expect.anything()]);
      expect(scene.tweens.killTweensOf).toHaveBeenCalledTimes(2);
    });

    it('takes the look of the role from the skin it is given', () => {
      const skin: HudSkin = {
        ...DEFAULT_HUD_SKIN,
        buttons: new Map([['DESTRUCTIVE', { fill: 'RESULT_DEFEAT', fillUnderPointer: 'HIT_FLASH', border: null, text: 'HUD_TEXT' }]])
      };

      const button = createButton(scene, 'DESTRUCTIVE', 'Rendirse', skin) as unknown as FakeText;

      expect(button.background).toBe('#e74c3c');
    });
  });

  describe('buttonFill', () => {
    // VIEW-38
    it('mixes the fill of the role with white', () => {
      expect([buttonFill('PRIMARY', 0), buttonFill('PRIMARY', 0.2)]).toEqual(['#1a5fa8', '#487fb9']);
    });
  });

  describe('createPanel', () => {
    it('draws the HUD panel with its fill and its border', () => {
      const panel = createPanel(scene, 'HUD') as unknown as FakeRectangle;

      expect([panel.fill, panel.alpha, panel.stroke]).toEqual([0x1b2631, 1, [2, 0x34495e]]);
    });

    it('draws the panel of the notices translucent and without a border', () => {
      const panel = createPanel(scene, 'NOTICE') as unknown as FakeRectangle;

      expect([panel.alpha, panel.stroke]).toEqual([0.95, undefined]);
    });
  });

  describe('panelBackground', () => {
    it('gives the fill of the panel as a text color', () => {
      expect(panelBackground('NOTICE')).toBe('#1b2631');
    });
  });

  describe('accents', () => {
    it('gives the color of each accent', () => {
      expect([accentColor('LOCAL_TURN'), accentColor('POSITIVE'), accentColor('NEGATIVE')]).toEqual(['#f1c40f', '#2ecc71', '#e74c3c']);
    });

    it('dims what is disabled and leaves the rest as it is', () => {
      expect([accentAlpha('DISABLED'), accentAlpha('POSITIVE')]).toEqual([0.4, 1]);
    });
  });
});
