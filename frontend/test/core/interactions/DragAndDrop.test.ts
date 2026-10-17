import { beforeEach, describe, expect, it, vi } from 'vitest';
import dragAndDrop from '@/core/interactions/DragAndDrop';
import CardAnimator from '@/core/visual_effects/CardAnimator';
import { dispatchAction } from '@/core/interactions/CardInteractionDispatcher';
import { getTopGameObjectAtCursor } from '@/core/interactions/InteractiveObjectManager';
import CombatantView from '@/game/cards/CombatantView';
import HandView from '@/game/hand/HandView';
import ZoneSlotView from '@/game/zone/ZoneSlotView';
import type CardView from '@/game/cards/CardView';
import type { GameScene } from '@/scenes/Game';

vi.mock('@/core/visual_effects/CardAnimator', () => ({
  default: {
    playAnimation: vi.fn(),
    playTween: vi.fn(),
  }
}));

vi.mock('@/core/interactions/CardInteractionDispatcher', () => ({
  dispatchAction: vi.fn(),
}));

vi.mock('@/core/interactions/InteractiveObjectManager', () => ({
  getTopGameObjectAtCursor: vi.fn(),
}));

describe('CardDragAndDropManager', () => {
  let mockScene: GameScene;
  let canvasStyle: { cursor: string };
  let activePointer: { worldX: number; worldY: number };

  beforeEach(() => {
    vi.clearAllMocks();

    canvasStyle = { cursor: 'default' };
    activePointer = { worldX: 200, worldY: 300 };

    mockScene = {
      tweens: {
        killTweensOf: vi.fn(),
      },
      input: {
        activePointer,
        manager: {
          canvas: { style: canvasStyle }
        }
      },
      add: {
        existing: vi.fn()
      }
    } as unknown as GameScene;
  });

  const createMockCard = (canBeClicked = true) => {
    const card = Object.create(CombatantView.prototype);
    card.canBeClicked = vi.fn(() => canBeClicked);
    card.setScale = vi.fn();
    card.setAngle = vi.fn();
    card.setPosition = vi.fn();
    card.reset = vi.fn();
    card.card = { id: 'c1' };
    return card as CombatantView;
  };

  const createMockHand = (cardIndex = 0) => {
    const hand = Object.create(HandView.prototype);
    hand.getIndex = vi.fn(() => cardIndex);
    hand.remove = vi.fn();
    hand.addAt = vi.fn();
    hand.hideCards = vi.fn();
    hand.disableCardListeners = vi.fn();
    hand.enableCardListeners = vi.fn();
    return hand as HandView;
  };

  const createMockZoneSlot = (canPlace = true, cardIndex = 0) => {
    const slot = Object.create(ZoneSlotView.prototype);
    slot.zoneSlot = { canPlaceCard: vi.fn(() => canPlace) };
    slot.applyAnimation = vi.fn();
    slot.previewCard = vi.fn();
    slot.stopPreviewingCard = vi.fn();
    slot.getIndex = vi.fn(() => cardIndex);
    slot.remove = vi.fn();
    slot.addAt = vi.fn();
    return slot as ZoneSlotView;
  };

  describe('onGrabCard', () => {
    it('returns false and does nothing when card cannot be clicked', () => {
      const card = createMockCard(false);
      const result = dragAndDrop.onGrabCard(mockScene, card);

      expect(result).toBe(false);
      expect(canvasStyle.cursor).toBe('default');
      expect(CardAnimator.playAnimation).not.toHaveBeenCalled();
    });

    it('sets cursor to grabbing, plays startDrag animation, and prepares source when grab succeeds from Hand', () => {
      const card = createMockCard(true);
      const hand = createMockHand(2);
      vi.mocked(getTopGameObjectAtCursor).mockReturnValue(hand);

      const result = dragAndDrop.onGrabCard(mockScene, card);

      expect(result).toBe(true);
      expect(canvasStyle.cursor).toBe('grabbing');
      expect(mockScene.tweens.killTweensOf).toHaveBeenCalledWith(card);
      expect(CardAnimator.playAnimation).toHaveBeenCalledWith(mockScene, card, 'startDrag');
      expect(hand.remove).toHaveBeenCalledWith(card);
      expect(hand.hideCards).toHaveBeenCalled();
      expect(hand.disableCardListeners).toHaveBeenCalled();
      expect(mockScene.add.existing).toHaveBeenCalledWith(card);
    });

    it('highlights zone slot as source when grabbed from ZoneSlotView', () => {
      const card = createMockCard(true);
      const slot = createMockZoneSlot();
      vi.mocked(getTopGameObjectAtCursor).mockReturnValue(slot);

      const result = dragAndDrop.onGrabCard(mockScene, card);

      expect(result).toBe(true);
      expect(slot.applyAnimation).toHaveBeenCalledWith('highlight_as_source');
    });
  });

  describe('onDragEnter and onDragLeave', () => {
    it('previews card and highlights target when dragged over a valid zone slot', () => {
      const card = createMockCard(true);
      const slot = createMockZoneSlot(true);

      dragAndDrop.onDragEnter(mockScene, card, slot);

      expect(slot.previewCard).toHaveBeenCalledWith(card);
      expect(slot.applyAnimation).toHaveBeenCalledWith('highlight_as_target');
    });

    it('does not preview card if zone slot rejects the card', () => {
      const card = createMockCard(true);
      const slot = createMockZoneSlot(false);

      dragAndDrop.onDragEnter(mockScene, card, slot);

      expect(slot.previewCard).not.toHaveBeenCalled();
      expect(slot.applyAnimation).not.toHaveBeenCalledWith('highlight_as_target');
    });

    it('stops preview and unhighlights on onDragLeave', () => {
      const card = createMockCard(true);
      const slot = createMockZoneSlot(true);

      dragAndDrop.onDragEnter(mockScene, card, slot);
      dragAndDrop.onDragLeave(mockScene, card, slot);

      expect(slot.stopPreviewingCard).toHaveBeenCalled();
      expect(slot.applyAnimation).toHaveBeenCalledWith('unhighlight');
    });
  });

  describe('onDragCard', () => {
    it('updates card position to active pointer coordinates when no target is locked', () => {
      const card = createMockCard(true);

      dragAndDrop.onDragCard(mockScene, card, 0, 0);

      expect(card.setScale).toHaveBeenCalledWith(0.7);
      expect(card.setAngle).toHaveBeenCalledWith(0);
      expect(card.setPosition).toHaveBeenCalledWith(200, 300);
    });
  });

  describe('onDropCard and onDragEnd', () => {
    it('dispatches action, unhighlights target slot, and restores cursor on successful drop', () => {
      const card = createMockCard(true);
      const hand = createMockHand(0);
      const targetSlot = createMockZoneSlot(true);

      vi.mocked(getTopGameObjectAtCursor).mockReturnValue(hand);
      dragAndDrop.onGrabCard(mockScene, card);

      vi.mocked(dispatchAction).mockReturnValue(true);

      const dropResult = dragAndDrop.onDropCard(mockScene, card, targetSlot);
      expect(dropResult).toBe(true);
      expect(dispatchAction).toHaveBeenCalledWith(mockScene, card, hand, targetSlot);
      expect(targetSlot.applyAnimation).toHaveBeenCalledWith('unhighlight');

      // Finish drag
      dragAndDrop.onDragEnd(mockScene, card);
      expect(canvasStyle.cursor).toBe('grab');
      expect(CardAnimator.playAnimation).toHaveBeenCalledWith(mockScene, card, 'endDrag');
      expect(card.reset).toHaveBeenCalled();
      expect(hand.enableCardListeners).toHaveBeenCalled();
      // Should NOT re-add card to hand on success
      expect(hand.addAt).not.toHaveBeenCalled();
    });

    it('returns card to source hand on failed drop', () => {
      const card = createMockCard(true);
      const hand = createMockHand(1);
      const targetSlot = createMockZoneSlot(true);

      vi.mocked(getTopGameObjectAtCursor).mockReturnValue(hand);
      dragAndDrop.onGrabCard(mockScene, card);

      vi.mocked(dispatchAction).mockReturnValue(false);

      dragAndDrop.onDropCard(mockScene, card, targetSlot);
      dragAndDrop.onDragEnd(mockScene, card);

      expect(hand.addAt).toHaveBeenCalledWith(card, 1);
    });
  });
});
