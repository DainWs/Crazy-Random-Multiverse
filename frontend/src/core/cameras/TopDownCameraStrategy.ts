import type { Point2D, Point3D } from '@/domain/Geometry';
import type BoardCameraStrategy from '@/core/cameras/BoardCameraStrategy';
import type { BoardFraming, CameraFrame } from '@/core/cameras/BoardCameraStrategy';
import type { TopDownReserves } from '@/core/cameras/CameraCalculations';
import * as Constants from '@/core/Constants';
import { calculateTopDownFrame } from '@/core/cameras/CameraCalculations';
import { DEPTH_OFFSET, FOCAL_LENGTH } from '@/core/cameras/TiltedCameraStrategy';
import { CARD_HEIGHT } from '@/game/cards/CardDimensions';
import { HAND_CARD_SCALE, HAND_RESTING_HIDDEN_RATIO } from '@/game/hand/HandLayoutCalculator';

/** The scale of every point of the board: the one the tilted camera has at the center of the table, so the sizes in the world stay alike. */
const TOP_DOWN_SCALE = FOCAL_LENGTH / DEPTH_OFFSET;

/** Height of the hand at rest on the screen, in px of the window (VIEW-16). */
const HAND_AT_REST_HEIGHT = CARD_HEIGHT * HAND_CARD_SCALE * (1 - HAND_RESTING_HIDDEN_RATIO);

/** The table stays between the rows of pieces at the corners of the HUD and above the hand, so none of them covers it at any width. */
const TOP_DOWN_RESERVES: TopDownReserves = {
    top: Constants.HUD_CORNER_PIECES_REACH,
    bottom: Math.max(Constants.HUD_CORNER_PIECES_REACH, HAND_AT_REST_HEIGHT),
    labelDepth:
        Constants.ZONE_BAR_GAP +
        Constants.ZONE_BAR_THICKNESS +
        Constants.ZONE_NAME_GAP +
        2 * Constants.ZONE_LABEL_PADDING +
        Constants.ZONE_NAME_LINE_HEIGHT
};

/** The table seen from straight above: every point of it at the same scale (VIEW-57). */
class TopDownCameraStrategy implements BoardCameraStrategy {
    public readonly deformsCards = false;
    public readonly showsTableDepth = false;

    public project(point: Point2D): Point3D {
        return { x: point.x * TOP_DOWN_SCALE, y: point.y * TOP_DOWN_SCALE, z: DEPTH_OFFSET, scale: TOP_DOWN_SCALE };
    }

    public frame({ screen, boardBounds, zoneEdgeMargin }: BoardFraming): CameraFrame {
        return calculateTopDownFrame({
            screen,
            boardBounds,
            zoneEdgeMargin: zoneEdgeMargin * TOP_DOWN_SCALE,
            pixelRatio: Constants.RENDER_SCALE,
            reserves: TOP_DOWN_RESERVES
        });
    }
}

export { TOP_DOWN_SCALE, TOP_DOWN_RESERVES };
export default TopDownCameraStrategy;
