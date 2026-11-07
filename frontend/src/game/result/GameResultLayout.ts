import type { Point2D, Size2D } from '@/domain/Geometry';
import * as Constants from '@/core/Constants';

type GameResultLayoutPositions = {
    veil: Size2D;
    title: Point2D;
    winner: Point2D;
    countdown: Point2D;
};

/** Pure layout of the result of the game for a screen size: three centered lines over a veil (WIN-4). */
class GameResultLayout {
    private readonly screen: Size2D;

    public constructor(screen: Size2D) {
        this.screen = screen;
    }

    public positions(): GameResultLayoutPositions {
        const { width, height } = this.screen;
        const centerX = width / 2;
        const centerY = height / 2;

        return {
            veil: { width, height },
            title: { x: centerX, y: centerY - Constants.GAME_RESULT_LINE_GAP },
            winner: { x: centerX, y: centerY + Constants.GAME_RESULT_LINE_GAP },
            countdown: { x: centerX, y: centerY + 2 * Constants.GAME_RESULT_LINE_GAP }
        };
    }
}

export default GameResultLayout;
