import * as Constants from '@/core/Constants';

enum PlayerPosition {
    BOTTOM = 'bottom',
    TOP = 'top',
    LEFT = 'left',
    RIGHT = 'right'
}

interface LayoutState {
    x: number;
    y: number;
    rotation: number;
}

class BattlefieldLayout {
    public static getPlayerLayout(pos: PlayerPosition): LayoutState {
        const zoneHalfWidth = 310;
        const zoneHalfHeight = 460;

        const margin = Constants.BATTLEFIELD_ZONE_MARGIN;
        const positionMap = new Map<PlayerPosition, LayoutState>();
        
        positionMap.set(PlayerPosition.BOTTOM, { 
            x: 0, 
            y: Constants.BOARD_NEAR - zoneHalfHeight - margin, 
            rotation: 0 
        });
        
        positionMap.set(PlayerPosition.TOP, { 
            x: 0, 
            y: Constants.BOARD_FAR + zoneHalfHeight + margin, 
            rotation: 180 
        });
        
        positionMap.set(PlayerPosition.LEFT, { 
            x: -Constants.BOARD_HALF_WIDTH + zoneHalfHeight + margin, 
            y: 0, 
            rotation: 90 
        });
        
        positionMap.set(PlayerPosition.RIGHT, { 
            x: Constants.BOARD_HALF_WIDTH - zoneHalfHeight - margin, 
            y: 0, 
            rotation: -90 
        });

        return positionMap.get(pos) || { x: 0, y: 0, rotation: 0 };
    }
}

export { PlayerPosition }
export type { LayoutState }
export default BattlefieldLayout;