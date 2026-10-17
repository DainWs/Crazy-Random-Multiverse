import { describe, expect, it, vi } from 'vitest';
import CardInputManager from '@/core/interactions/CardInputManager';
import type CardView from '@/game/cards/CardView';
import type { GameScene } from '@/scenes/Game';

describe('CardInputManager', () => {
  const createMockCard = () => {
    const registeredListeners: { [event: string]: Function[] } = {};

    const card = {
      on: vi.fn((event: string, fn: Function) => {
        if (!registeredListeners[event]) registeredListeners[event] = [];
        registeredListeners[event].push(fn);
      }),
      off: vi.fn((event: string, fn: Function) => {
        if (!registeredListeners[event]) return;
        registeredListeners[event] = registeredListeners[event].filter(l => l !== fn);
      }),
      _registeredListeners: registeredListeners
    } as unknown as CardView & { _registeredListeners: typeof registeredListeners };

    return card;
  };

  const createMockScene = () => ({} as GameScene);

  it('registers all interaction event listeners on card', () => {
    const card = createMockCard();
    const scene = createMockScene();

    CardInputManager.handleCardInputs(scene, card);

    const expectedEvents = [
      'pointerover',
      'pointerout',
      'pointerup',
      'pointerdown',
      'dragstart',
      'dragend',
      'dragenter',
      'dragleave',
      'drag',
      'drop'
    ];

    for (const event of expectedEvents) {
      expect(card.on).toHaveBeenCalledWith(event, expect.any(Function));
      expect(card._registeredListeners[event]).toHaveLength(1);
    }
  });

  it('unregisters the exact same listener references on removeHandledCard', () => {
    const card = createMockCard();
    const scene = createMockScene();

    CardInputManager.handleCardInputs(scene, card);
    CardInputManager.removeHandledCard(scene, card);

    const expectedEvents = [
      'pointerover',
      'pointerout',
      'pointerup',
      'pointerdown',
      'dragstart',
      'dragend',
      'dragenter',
      'dragleave',
      'drag',
      'drop'
    ];

    for (const event of expectedEvents) {
      expect(card.off).toHaveBeenCalledWith(event, expect.any(Function));
      expect(card._registeredListeners[event]).toHaveLength(0);
    }
  });

  it('handles calling removeHandledCard safely when card was never registered', () => {
    const card = createMockCard();
    const scene = createMockScene();

    expect(() => CardInputManager.removeHandledCard(scene, card)).not.toThrow();
    expect(card.off).not.toHaveBeenCalled();
  });
});
