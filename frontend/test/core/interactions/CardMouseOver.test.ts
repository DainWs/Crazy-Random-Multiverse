import { beforeEach, describe, expect, it, vi } from 'vitest';
import CardMouseOver from '@/core/interactions/CardMouseOver';
import CardAnimator from '@/core/visual_effects/CardAnimator';
import type CardView from '@/game/cards/CardView';
import ZoneSlotView from '@/game/zone/ZoneSlotView';
import type { GameScene } from '@/scenes/Game';

vi.mock('@/core/visual_effects/CardAnimator', () => ({
  default: {
    playTween: vi.fn(),
    playAnimation: vi.fn(),
  }
}));

const mockAttackHandlesOver = vi.fn(() => false);
const mockAttackHandlesOut = vi.fn(() => false);
vi.mock('@/core/interactions/CardClickHandler', () => ({
  default: {
    onPointerOver: () => mockAttackHandlesOver(),
    onPointerOut: () => mockAttackHandlesOut()
  }
}));

describe('CardMouseOver', () => {
  let mockTooltipView: { show: ReturnType<typeof vi.fn>; hide: ReturnType<typeof vi.fn> };
  let mockScene: GameScene;
  let canvasStyle: { cursor: string };

  beforeEach(() => {
    vi.clearAllMocks();

    canvasStyle = { cursor: 'default' };
    mockTooltipView = {
      show: vi.fn(),
      hide: vi.fn()
    };

    mockScene = {
      input: {
        manager: {
          canvas: {
            style: canvasStyle
          }
        }
      },
      getCardTooltipView: () => mockTooltipView
    } as unknown as GameScene;
  });

  const createMockCard = (canBeClicked = true): CardView => {
    return {
      canBeClicked: vi.fn(() => canBeClicked)
    } as unknown as CardView;
  };

  describe('onPointerOver', () => {
    it('sets cursor to grab, plays hover tween, and shows tooltip when card is clickable', () => {
      const card = createMockCard(true);

      CardMouseOver.onPointerOver(mockScene, card);

      expect(canvasStyle.cursor).toBe('grab');
      expect(CardAnimator.playTween).toHaveBeenCalledWith(card, 'hover');
      expect(mockTooltipView.show).toHaveBeenCalledWith(card);
    });

    it('plays hover tween and shows tooltip but leaves cursor default when card is not clickable', () => {
      const card = createMockCard(false);

      CardMouseOver.onPointerOver(mockScene, card);

      expect(canvasStyle.cursor).toBe('default');
      expect(CardAnimator.playTween).toHaveBeenCalledWith(card, 'hover');
      expect(mockTooltipView.show).toHaveBeenCalledWith(card);
    });

    // VIEW-4
    it('shows the tooltip but does not enlarge the card when the attack in course lifts it instead', () => {
      mockAttackHandlesOver.mockReturnValueOnce(true);
      const card = createMockCard(true);

      CardMouseOver.onPointerOver(mockScene, card);

      expect(CardAnimator.playTween).not.toHaveBeenCalled();
      expect(mockTooltipView.show).toHaveBeenCalledWith(card);
    });
  });

  // VIEW-37
  describe('a card that can attack', () => {
    const createReadyCard = () => {
      const slot = Object.create(ZoneSlotView.prototype) as ZoneSlotView;
      slot.hasReadyMark = () => true;
      slot.holdReadyMark = vi.fn();

      return { slot, card: { canBeClicked: vi.fn(() => true), parentContainer: slot } as unknown as CardView };
    };

    it('shows the hand that points and keeps its frame fully opaque while the pointer is over it', () => {
      const { slot, card } = createReadyCard();

      CardMouseOver.onPointerOver(mockScene, card);

      expect(canvasStyle.cursor).toBe('pointer');
      expect(slot.holdReadyMark).toHaveBeenCalledWith(true);
    });

    it('lets its frame pulse again when the pointer leaves', () => {
      const { slot, card } = createReadyCard();

      CardMouseOver.onPointerOut(mockScene, card);

      expect(slot.holdReadyMark).toHaveBeenCalledWith(false);
    });

    it('still gets the enlargement and the side panel', () => {
      const { card } = createReadyCard();

      CardMouseOver.onPointerOver(mockScene, card);

      expect(CardAnimator.playTween).toHaveBeenCalledWith(card, 'hover');
      expect(mockTooltipView.show).toHaveBeenCalledWith(card);
    });
  });

  describe('onPointerOut', () => {
    it('resets cursor to default, plays unhover tween, and hides tooltip', () => {
      const card = createMockCard(true);
      canvasStyle.cursor = 'grab';

      CardMouseOver.onPointerOut(mockScene, card);

      expect(canvasStyle.cursor).toBe('default');
      expect(CardAnimator.playTween).toHaveBeenCalledWith(card, 'unhover');
      expect(mockTooltipView.hide).toHaveBeenCalledTimes(1);
    });

    // VIEW-4
    it('hides the tooltip but does not lower the card when the attack in course lowers it instead', () => {
      mockAttackHandlesOut.mockReturnValueOnce(true);

      CardMouseOver.onPointerOut(mockScene, createMockCard(true));

      expect(CardAnimator.playTween).not.toHaveBeenCalled();
      expect(mockTooltipView.hide).toHaveBeenCalledTimes(1);
    });
  });
});
