import type { Point2D, Size2D } from '@/domain/Geometry';
import * as Constants from '@/core/Constants';

/** Pure layout of the loading screen for the size of the window: everything is centered on it (VIEW-29). */
class GameLoadLayout {
    private readonly center: Point2D;

    public constructor(screen: Size2D) {
        this.center = { x: screen.width / 2, y: screen.height / 2 };
    }

    public panel(): Point2D & Size2D {
        return { x: this.center.x, y: this.center.y + Constants.LOAD_PANEL_OFFSET_Y, ...Constants.LOAD_PANEL_SIZE };
    }

    public barFrame(): Point2D & Size2D {
        return { x: this.center.x, y: this.center.y + Constants.LOAD_BAR_OFFSET_Y, ...Constants.LOAD_BAR_SIZE };
    }

    /** Where the fill starts, on the left edge of the frame, and the room it can take. */
    public barFill(): Point2D & Size2D {
        const frame = this.barFrame();
        const margin = Constants.LOAD_BAR_FILL_MARGIN;

        return { x: frame.x - frame.width / 2 + margin, y: frame.y, width: frame.width - margin * 2, height: frame.height - margin * 2 };
    }

    public statusText(): Point2D {
        return { x: this.center.x, y: this.center.y + Constants.LOAD_BAR_OFFSET_Y + Constants.LOAD_STATUS_OFFSET_Y };
    }

    public retryButton(): Point2D {
        return { x: this.center.x, y: this.center.y + Constants.LOAD_BAR_OFFSET_Y + Constants.LOAD_RETRY_OFFSET_Y };
    }
}

export default GameLoadLayout;
