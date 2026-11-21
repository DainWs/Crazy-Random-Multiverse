import { beforeEach, describe, expect, it, vi } from 'vitest';
import CardMouseOver from '@/core/interactions/CardMouseOver';
import CardAnimator from '@/core/visual_effects/CardAnimator';
import type CardView from '@/game/cards/CardView';
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
