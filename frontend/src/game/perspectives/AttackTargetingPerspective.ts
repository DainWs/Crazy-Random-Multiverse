import type Perspective from "@/game/perspectives/Perspective";
import type ZoneSlotView from "@/game/zone/ZoneSlotView";
import type { GameScene } from "@/scenes/Game";
import { getTopGameObjectAtCursor } from "@/core/interactions/InteractiveObjectManager";
import CardView from "@/game/cards/CardView";
import * as Constants from "@/core/Constants";

const CANCEL_KEY_EVENT = "keydown-ESC";

/** Draws an arrow from the attacking slot to the pointer, green over a target it can reach and red otherwise (VIEW-4). */
class AttackTargetingPerspective implements Perspective {
    public readonly sourceSlot: ZoneSlotView;

    private readonly scene: GameScene;
    private readonly onCancel: () => void;
    private arrow: Phaser.GameObjects.Graphics | null = null;

    private readonly handlePointerMove = (pointer: Phaser.Input.Pointer) => this.drawArrow(pointer);
    private readonly handlePointerDown = (_pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
        if (!currentlyOver.some((object) => object instanceof CardView)) {
            this.onCancel();
        }
    };
    private readonly handleCancelKey = () => this.onCancel();

    constructor(scene: GameScene, sourceSlot: ZoneSlotView, onCancel: () => void) {
        this.scene = scene;
        this.sourceSlot = sourceSlot;
        this.onCancel = onCancel;
    }

    public enter(): void {
        this.arrow = this.scene.add.graphics();
        this.arrow.setDepth(Constants.ATTACK_ARROW_DEPTH);

        this.scene.input.on("pointermove", this.handlePointerMove);
        this.scene.input.on("pointerdown", this.handlePointerDown);
        this.scene.input.keyboard?.on(CANCEL_KEY_EVENT, this.handleCancelKey);
        this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleCancelKey);
        this.drawArrow(this.scene.input.activePointer);
    }

    public exit(): void {
        this.scene.input.off("pointermove", this.handlePointerMove);
        this.scene.input.off("pointerdown", this.handlePointerDown);
        this.scene.input.keyboard?.off(CANCEL_KEY_EVENT, this.handleCancelKey);
        this.scene.events.off(Phaser.Scenes.Events.SHUTDOWN, this.handleCancelKey);
        this.arrow?.destroy();
        this.arrow = null;
    }

    /** The zones are drawn again when the state changes, which destroys the slot the arrow starts from. */
    private drawArrow(pointer: Phaser.Input.Pointer): void {
        if (!this.sourceSlot.active) {
            this.onCancel();
            return;
        }

        const origin = this.sourceSlot.getWorldTransformMatrix();
        const hoveredSlot = getTopGameObjectAtCursor(this.scene, "ZoneSlotView") as ZoneSlotView | undefined;
        const color = hoveredSlot && this.sourceSlot.canAttack(hoveredSlot) ? Constants.ATTACK_ARROW_VALID_COLOR : Constants.ATTACK_ARROW_INVALID_COLOR;

        this.arrow?.clear();
        this.arrow?.lineStyle(Constants.ATTACK_ARROW_LINE_WIDTH, color);
        this.arrow?.lineBetween(origin.tx, origin.ty, pointer.worldX, pointer.worldY);
        this.arrow?.fillStyle(color);
        this.arrow?.fillTriangle(...this.calculateArrowHead(origin.tx, origin.ty, pointer.worldX, pointer.worldY));
    }

    private calculateArrowHead(fromX: number, fromY: number, toX: number, toY: number): [number, number, number, number, number, number] {
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const left = angle + Math.PI - Constants.ATTACK_ARROW_HEAD_ANGLE;
        const right = angle + Math.PI + Constants.ATTACK_ARROW_HEAD_ANGLE;

        return [
            toX, toY,
            toX + Constants.ATTACK_ARROW_HEAD_LENGTH * Math.cos(left), toY + Constants.ATTACK_ARROW_HEAD_LENGTH * Math.sin(left),
            toX + Constants.ATTACK_ARROW_HEAD_LENGTH * Math.cos(right), toY + Constants.ATTACK_ARROW_HEAD_LENGTH * Math.sin(right)
        ];
    }
}

export default AttackTargetingPerspective;
