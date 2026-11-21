type TooltipSide = 'LEFT' | 'RIGHT';

/** Pure layout of the side panel of a card (VIEW-14). */
class TooltipLayout {
  /** The panel is on the right, unless the card is in the right half of the screen: then it is on the left, so it does not cover the card. `cardShare` is the position of the card from the left edge of the screen, from 0 to 1. */
  public sideOf(cardShare: number): TooltipSide {
    return cardShare > 0.5 ? 'LEFT' : 'RIGHT';
  }

  /** The center of the panel on the screen, with the slide of its opening: it comes in from its own side. */
  public centerX(side: TooltipSide, screenWidth: number, panelWidth: number, slide: number): number {
    return side === 'RIGHT' ? screenWidth - panelWidth / 2 + slide : panelWidth / 2 - slide;
  }
}

export type { TooltipSide };
export default TooltipLayout;
