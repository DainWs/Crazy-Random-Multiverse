import type { Point2D, Size2D } from '@/domain/Geometry';
import * as Constants from '@/core/Constants';
import { calculateScreenFixedTransform } from '@/core/cameras/CameraCalculations';
import type { ScreenFixedTransform } from '@/core/cameras/CameraCalculations';

type ConfirmDialogLayout = {
    veil: Size2D;
    panel: Point2D & Size2D;
    question: Point2D;
    yes: Point2D;
    no: Point2D;
};

/**
 * Pure layout of the game HUD for a screen size and a camera zoom (UI-3, UI-15). The HUD does not follow the camera
 * but the zoom still scales it, so the positions the layout gives and the scale to draw them with undo it.
 */
class GameHudLayout {
    private readonly screen: Size2D;
    private readonly transform: ScreenFixedTransform;

    public constructor(screen: Size2D, zoom: number = 1) {
        this.screen = screen;
        this.transform = calculateScreenFixedTransform(screen.width, screen.height, zoom);
    }

    /** The scale of every element of the HUD. */
    public scale(): number {
        return this.transform.scale;
    }

    /** Where to put a container whose children are placed by the screen positions of `confirmDialog`. */
    public dialogTransform(): ScreenFixedTransform {
        return this.transform;
    }

    public turnTextPosition(): Point2D {
        return this.place({ x: Constants.HUD_MARGIN, y: Constants.HUD_MARGIN });
    }

    /** Anchor of the bottom right corner of the button that passes the turn. */
    public passTurnButtonAnchor(): Point2D {
        return this.place(this.passTurnScreenAnchor());
    }

    /** Anchor of the bottom right corner of the surrender button, above the one that passes the turn. `buttonHeight` is the height of the button on the screen. */
    public surrenderButtonAnchor(buttonHeight: number): Point2D {
        const passTurn = this.passTurnScreenAnchor();
        return this.place({ 
            x: passTurn.x, 
            y: passTurn.y - buttonHeight - Constants.HUD_BUTTON_GAP 
        });
    }

    private passTurnScreenAnchor(): Point2D {
        return { x: this.screen.width - Constants.HUD_MARGIN, y: this.screen.height - Constants.HUD_MARGIN };
    }

    private place(screenPosition: Point2D): Point2D {
        const { x, y, scale } = this.transform;
        return { 
            x: x + screenPosition.x * scale, 
            y: y + screenPosition.y * scale 
        };
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
