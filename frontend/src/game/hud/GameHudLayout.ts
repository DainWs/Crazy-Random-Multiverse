import type { Point2D, Size2D } from '@/domain/Geometry';
import * as Constants from '@/core/Constants';

type ConfirmDialogLayout = {
    veil: Size2D;
    panel: Point2D & Size2D;
    question: Point2D;
    yes: Point2D;
    no: Point2D;
};

/** Pure layout of the game HUD for a screen size (UI-3, UI-15). */
class GameHudLayout {
    private readonly screen: Size2D;

    public constructor(screen: Size2D) {
        this.screen = screen;
    }

    public turnTextPosition(): Point2D {
        return { x: Constants.HUD_MARGIN, y: Constants.HUD_MARGIN };
    }

    /** Anchor of the bottom right corner of the button that passes the turn. */
    public passTurnButtonAnchor(): Point2D {
        return { x: this.screen.width - Constants.HUD_MARGIN, y: this.screen.height - Constants.HUD_MARGIN };
    }

    /** Anchor of the bottom right corner of the surrender button, above the one that passes the turn. */
    public surrenderButtonAnchor(buttonHeight: number): Point2D {
        const passTurn = this.passTurnButtonAnchor();
        return { x: passTurn.x, y: passTurn.y - buttonHeight - Constants.HUD_BUTTON_GAP };
    }

    public confirmDialog(): ConfirmDialogLayout {
        const { width, height } = this.screen;
        const { width: dialogWidth, height: dialogHeight } = Constants.CONFIRM_DIALOG_SIZE;

        const centerX = width / 2;
        const centerY = height / 2;

        const quarterWidth = dialogWidth / 4;
        const quarterHeight = dialogHeight / 4;
        const buttonY = centerY + quarterHeight;

        return {
            veil: { width, height },
            panel: { x: centerX, y: centerY, width: dialogWidth, height: dialogHeight },
            question: { x: centerX, y: centerY - quarterHeight },
            yes: { x: centerX - quarterWidth, y: buttonY },
            no: { x: centerX + quarterWidth, y: buttonY }
        };
    }
}

export default GameHudLayout;
