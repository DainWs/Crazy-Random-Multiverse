import type Perspective from "@/game/perspectives/Perspective";
import type ZoneSlotView from "@/game/zone/ZoneSlotView";
import type { GameScene } from "@/scenes/Game";
import type { LiftSize } from "@/game/zone/CardLift";
import Phaser from "phaser";
import CardView from "@/game/cards/CardView";
import CardLift from "@/game/zone/CardLift";
import StoreSystem from "@/core/StoreSystem";
import * as Constants from "@/core/Constants";

const CANCEL_KEY_EVENT = "keydown-ESC";

const ATTACKER_LIFT: LiftSize = { scale: Constants.ATTACKER_LIFT_SCALE, shadowOffset: Constants.ATTACKER_SHADOW_OFFSET };
const TARGET_LIFT: LiftSize = { scale: Constants.TARGET_LIFT_SCALE, shadowOffset: Constants.TARGET_SHADOW_OFFSET };

type LiftedTarget = { slot: ZoneSlotView; lift: CardLift };

/** The selected attacker is lifted, and so is the rival card under the pointer, framed green if it can be attacked and red if not (VIEW-4). */
class AttackTargetingPerspective implements Perspective {
    public readonly sourceSlot: ZoneSlotView;

    private readonly scene: GameScene;
    private readonly onCancel: () => void;
    private readonly sourceLift: CardLift;
    private target?: LiftedTarget;
    private committed = false;

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
        this.sourceLift = new CardLift(scene, sourceSlot, ATTACKER_LIFT);
    }

    public enter(): void {
        this.sourceLift.lift();

        this.scene.input.on("pointerdown", this.handlePointerDown);
        this.scene.input.keyboard?.on(CANCEL_KEY_EVENT, this.handleCancelKey);
        this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleCancelKey);
    }

    public exit(): void {
        this.stopListening();
        this.sourceLift.lower();
        this.target?.lift.lower();
        this.target = undefined;
        this.scene.restoreBoardOrder();
    }

    public isCommitted(): boolean {
        return this.committed;
    }

    /** The attacker and the target stay lifted while the server answers; only `exit` lowers them (VIEW-4, UI-4). */
    public commit(targetSlot: ZoneSlotView): void {
        this.stopListening();
        this.committed = true;

        if (this.target?.slot !== targetSlot) {
            this.liftTarget(targetSlot);
        }
    }

    /** Whether the hover of the card in `slot` is the lift of the attack and not the enlargement of `VIEW-14`. */
    public hover(slot: ZoneSlotView): boolean {
        if (this.committed || slot === this.sourceSlot || this.isOwn(slot)) {
            return this.isInvolved(slot);
        }

        this.liftTarget(slot);
        return true;
    }

    public unhover(slot: ZoneSlotView): boolean {
        if (this.committed || slot === this.sourceSlot || this.isOwn(slot)) {
            return this.isInvolved(slot);
        }

        if (this.target?.slot === slot) {
            this.target.lift.lower();
            this.target = undefined;
        }

        return true;
    }

    private liftTarget(slot: ZoneSlotView): void {
        this.target?.lift.lower();

        const lift = new CardLift(this.scene, slot, TARGET_LIFT);
        lift.lift();
        lift.frame(this.sourceSlot.canAttack(slot));
        this.target = { slot, lift };
    }

    private isOwn(slot: ZoneSlotView): boolean {
        return slot.zone.isPlayerOwner(StoreSystem.getPlayer());
    }

    private isInvolved(slot: ZoneSlotView): boolean {
        return slot === this.sourceSlot || slot === this.target?.slot;
    }

    private stopListening(): void {
        this.scene.input.off("pointerdown", this.handlePointerDown);
        this.scene.input.keyboard?.off(CANCEL_KEY_EVENT, this.handleCancelKey);
        this.scene.events.off(Phaser.Scenes.Events.SHUTDOWN, this.handleCancelKey);
    }
}

export default AttackTargetingPerspective;
