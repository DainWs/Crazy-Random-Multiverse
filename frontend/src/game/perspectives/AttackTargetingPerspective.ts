import type Perspective from "@/game/perspectives/Perspective";
import type ZoneSlotView from "@/game/zone/ZoneSlotView";
import type { GameScene } from "@/scenes/Game";
import Phaser from "phaser";
import { getTopGameObjectAtCursor } from "@/core/interactions/InteractiveObjectManager";
import CardView from "@/game/cards/CardView";
import AttackArrowLayout from "@/game/perspectives/AttackArrowLayout";
import * as Constants from "@/core/Constants";

const CANCEL_KEY_EVENT = "keydown-ESC";

/** Draws an arrow from the attacking slot to the pointer, green over a target it can reach and red otherwise (VIEW-4). */
class AttackTargetingPerspective implements Perspective {
    public readonly sourceSlot: ZoneSlotView;

    private readonly scene: GameScene;
    private readonly onCancel: () => void;
    private arrow: Phaser.GameObjects.Graphics | null = null;

    private readonly handlePointerMove = (pointer: Phaser.Input.Pointer) => this.drawArrow(pointer);
    private readonly handlePointerDown = (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
        if (pointer.button !== Constants.PRIMARY_BUTTON) return;

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
        this.highlightSlots();
        this.arrow = this.scene.add.graphics();
        this.arrow.setDepth(Constants.ATTACK_ARROW_DEPTH);

        this.scene.input.on("pointermove", this.handlePointerMove);
        this.scene.input.on("pointerdown", this.handlePointerDown);
        this.scene.input.keyboard?.on(CANCEL_KEY_EVENT, this.handleCancelKey);
        this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleCancelKey);
        this.drawArrow(this.scene.input.activePointer);
    }

    public exit(): void {
        this.unhighlightSlots();
        this.scene.input.off("pointermove", this.handlePointerMove);
        this.scene.input.off("pointerdown", this.handlePointerDown);
        this.scene.input.keyboard?.off(CANCEL_KEY_EVENT, this.handleCancelKey);
        this.scene.events.off(Phaser.Scenes.Events.SHUTDOWN, this.handleCancelKey);
        this.arrow?.destroy();
        this.arrow = null;
    }

    /** Marks the attacker and the cards it can attack (UI-5). */
    private highlightSlots(): void {
        this.sourceSlot.applyAnimation("highlight_as_source");
        for (const slot of this.getSlots()) {
            if (this.sourceSlot.canAttack(slot)) {
                slot.applyAnimation("highlight_as_target");
            }
        }
    }

    private unhighlightSlots(): void {
        for (const slot of [this.sourceSlot, ...this.getSlots()]) {
            if (slot.active) {
                slot.applyAnimation("unhighlight");
            }
        }
    }

    private getSlots(): ZoneSlotView[] {
        return this.scene.zones.flatMap((zone) => zone.getSlots().flat());
    }

    /** The zones are drawn again when the state changes, which destroys the slot the arrow starts from. */
    private drawArrow(pointer: Phaser.Input.Pointer): void {
        if (!this.sourceSlot.active) {
            this.onCancel();
            return;
        }

        const origin = this.sourceSlot.getWorldTransformMatrix();
        const hoveredSlot = getTopGameObjectAtCursor(this.scene, "ZoneSlotView") as ZoneSlotView | undefined;
        const target = hoveredSlot && this.sourceSlot.canAttack(hoveredSlot) ? hoveredSlot : undefined;
        const color = target ? Constants.ATTACK_ARROW_VALID_COLOR : Constants.ATTACK_ARROW_INVALID_COLOR;

        const layout = new AttackArrowLayout({ x: origin.tx, y: origin.ty });
        const tip = layout.tip({ x: pointer.worldX, y: pointer.worldY }, target && this.targetOf(target));

        this.arrow?.clear();
        this.arrow?.lineStyle(Constants.ATTACK_ARROW_LINE_WIDTH, color);
        this.arrow?.lineBetween(origin.tx, origin.ty, tip.x, tip.y);
        this.arrow?.fillStyle(color);
        this.arrow?.fillTriangle(...layout.head(tip));
    }

    private targetOf(slot: ZoneSlotView) {
        const center = slot.getWorldTransformMatrix();
        return { center: { x: center.tx, y: center.ty }, radius: AttackArrowLayout.targetRadius(slot.corners) };
    }
}

export default AttackTargetingPerspective;
