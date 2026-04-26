import ProjectionSystem from '@/core/ProjectionSystem';
import { BattlefieldSkin, DEFAULT_SKIN } from '@/game/board/BattlefieldSkins';
import * as Constants from '@/core/Constants';

class BattlefieldFloor extends Phaser.GameObjects.Graphics {
    private static readonly BOARD_HALF_WIDTH = Constants.BOARD_HALF_WIDTH;
    private static readonly BOARD_NEAR = Constants.BOARD_NEAR;
    private static readonly BOARD_FAR = Constants.BOARD_FAR;

    private skin: BattlefieldSkin;

    constructor(scene: Phaser.Scene, skin: BattlefieldSkin = DEFAULT_SKIN) {
        super(scene);
        this.skin = skin;
        this.setDepth(-10000);
        this.renderBoard();
        scene.add.existing(this);
    }

    public setSkin(skin: BattlefieldSkin) {
        this.skin = skin;
        this.renderBoard();
    }

    private renderBoard() {
        this.clear();
        this.renderTableThickness();
        this.renderBoardSurface();
        this.renderGridLines();
        this.renderBoardOutline();
    }

    private renderBoardSurface() {
        const hw = BattlefieldFloor.BOARD_HALF_WIDTH;
        const near = BattlefieldFloor.BOARD_NEAR;
        const far = BattlefieldFloor.BOARD_FAR;

        const quad = ProjectionSystem.projectQuad(-hw, hw, far, near);

        this.fillStyle(this.skin.boardColor, this.skin.boardAlpha);
        this.beginPath();
        this.moveTo(quad.tl.x, quad.tl.y);
        this.lineTo(quad.tr.x, quad.tr.y);
        this.lineTo(quad.br.x, quad.br.y);
        this.lineTo(quad.bl.x, quad.bl.y);
        this.closePath();
        this.fillPath();
    }

    private renderTableThickness() {
        const hw = BattlefieldFloor.BOARD_HALF_WIDTH;
        const near = BattlefieldFloor.BOARD_NEAR;
        const far = BattlefieldFloor.BOARD_FAR;
        const thickness = this.skin.thickness;

        const quadTop = ProjectionSystem.projectQuad(-hw, hw, far, near);
        
        this.fillStyle(this.skin.boardColor, this.skin.boardAlpha);
        this.lineStyle(2, this.skin.borderColor, this.skin.borderAlpha);
        
        // front of the table
        this.beginPath();
        this.moveTo(quadTop.bl.x, quadTop.bl.y);
        this.lineTo(quadTop.br.x, quadTop.br.y);
        this.lineTo(quadTop.br.x, quadTop.br.y + thickness);
        this.lineTo(quadTop.bl.x, quadTop.bl.y + thickness);
        this.closePath();
        this.fillPath();
        this.strokePath();

        // sides of the table
        this.beginPath();
        this.moveTo(quadTop.br.x, quadTop.br.y);
        this.lineTo(quadTop.tr.x, quadTop.tr.y);
        this.lineTo(quadTop.tr.x, quadTop.tr.y + thickness);
        this.lineTo(quadTop.br.x, quadTop.br.y + thickness);
        this.closePath();
        this.fillPath();
        this.strokePath();

        this.beginPath();
        this.moveTo(quadTop.bl.x, quadTop.bl.y);
        this.lineTo(quadTop.tl.x, quadTop.tl.y);
        this.lineTo(quadTop.tl.x, quadTop.tl.y + thickness);
        this.lineTo(quadTop.bl.x, quadTop.bl.y + thickness);
        this.closePath();
        this.fillPath();
        this.strokePath();

        // legs of the table
        const legHeight = this.skin.legHeight;
        const corners = [
            { x: -hw + (thickness * 2), y: far },
            { x: hw - (thickness * 2), y: far },
            { x: -hw + (thickness + 10), y: near },
            { x: hw - (thickness + 10), y: near }
        ];

        corners.forEach(pos => {
            const corner = ProjectionSystem.project(pos.x, pos.y);
            
            // body of the leg
            this.lineStyle(thickness, this.skin.boardColor, this.skin.boardAlpha);
            this.lineBetween(corner.x, corner.y, corner.x, corner.y + legHeight);
            
            // outline of the leg
            this.lineStyle(2, this.skin.borderColor, this.skin.borderAlpha);
            const offset = thickness / 2;
            this.lineBetween(corner.x - offset, corner.y, corner.x - offset, corner.y + legHeight);
            this.lineBetween(corner.x + offset, corner.y, corner.x + offset, corner.y + legHeight);
        });
    }

    private renderGridLines() {
        const hw = BattlefieldFloor.BOARD_HALF_WIDTH;
        const near = BattlefieldFloor.BOARD_NEAR;
        const far = BattlefieldFloor.BOARD_FAR;
        const step = this.skin.gridStep;

        this.lineStyle(1, this.skin.gridColor, this.skin.gridAlpha);
        for (let x = -hw; x <= hw; x += step) {
            const pNear = ProjectionSystem.project(x, near);
            const pFar = ProjectionSystem.project(x, far);
            this.moveTo(pNear.x, pNear.y);
            this.lineTo(pFar.x, pFar.y);
        }
        this.strokePath();

        for (let y = far; y <= near; y += step) {
            const pLeft = ProjectionSystem.project(-hw, y);
            const pRight = ProjectionSystem.project(hw, y);
            this.moveTo(pLeft.x, pLeft.y);
            this.lineTo(pRight.x, pRight.y);
        }
        this.strokePath();
    }

    private renderBoardOutline() {
        const hw = BattlefieldFloor.BOARD_HALF_WIDTH;
        const near = BattlefieldFloor.BOARD_NEAR;
        const far = BattlefieldFloor.BOARD_FAR;

        const quad = ProjectionSystem.projectQuad(-hw, hw, far, near);

        this.lineStyle(2, this.skin.borderColor, this.skin.borderAlpha);
        this.beginPath();
        this.moveTo(quad.tl.x, quad.tl.y);
        this.lineTo(quad.tr.x, quad.tr.y);
        this.lineTo(quad.br.x, quad.br.y);
        this.lineTo(quad.bl.x, quad.bl.y);
        this.closePath();
        this.strokePath();
    }
}

export default BattlefieldFloor;
