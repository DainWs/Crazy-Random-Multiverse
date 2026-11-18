import type { CardView } from "@/game/cards/CardView";
import type Perspective from "@/game/perspectives/Perspective";
import type ZoneView from "@/game/zone/ZoneView";
import type { TargetArea } from "@/game/perspectives/overlays/CalmTargetingOverlay";
import CalmTargetingOverlay from "@/game/perspectives/overlays/CalmTargetingOverlay";
import { playMotion } from "@/core/visual_effects/Motion";

type SelectedCard = CardView
type TargetZone = ZoneView;

const PerspectiveOptions = {
    card: {
        topPadding: 0,
        leftPadding: 150,
        // Not in the scale of VIEW-30 nor one of the four curves of VIEW-31: Phase 11.4 changes them.
        moveInDuration: 300,
        moveInEase: { ease: 'Cubic.easeOut' },
        moveOutDuration: 200,
        moveOutEase: { ease: 'Cubic.easeIn' }
    }
}

class CardActionPerspective implements Perspective {
    private readonly scene: Phaser.Scene;
    private readonly selectedCard: SelectedCard;
    private readonly targetZones: TargetZone[];
    private overlay: CalmTargetingOverlay;

    private currentZone: TargetZone | null;

    constructor(
        scene: Phaser.Scene,
        selectedCard: SelectedCard,
        targetZones: TargetZone[]
    ) {
        this.scene = scene;
        this.selectedCard = selectedCard;
        this.targetZones = targetZones;
        this.currentZone = this.targetZones[0] ?? null;

        this.overlay = new CalmTargetingOverlay(scene, this.targetAreaCollector.bind(this));
    }

    private targetAreaCollector(): TargetArea[] {
        if (!this.currentZone) return [];
        const targetAreas: TargetArea[] = [];

        const zoneBounds = this.currentZone.getBounds();
        const targetXOffset = zoneBounds.x;
        const targetYOffset = zoneBounds.y;
        for (const zoneSlot of this.currentZone.getSlots().flat()) {
            targetAreas.push({
                x: targetXOffset + zoneSlot.x,
                y: targetYOffset + zoneSlot.y,
                width: zoneSlot.displayWidth,
                height: zoneSlot.displayHeight
            });
        }
        return targetAreas;
    }

    public async enter() {
        this.selectedCard.disableInteractive();
        this.moveCardToLeftPanel();
        this.overlay.activate();
    }

    public async exit() {
        this.overlay.deactivate();
        await this.moveCardToOrigin();
        this.selectedCard.setInteractive();
    }

    private async moveCardToLeftPanel(): Promise<void> {
        const x = this.scene.cameras.main.x + PerspectiveOptions.card.leftPadding;
        const y = this.scene.cameras.main.y + PerspectiveOptions.card.topPadding +
            (this.scene.cameras.main.height / 2);

        this.selectedCard.setDepth(10000);
        await playMotion(this.scene, {
          targets: this.selectedCard,
          to: { x, y },
          duration: PerspectiveOptions.card.moveInDuration,
          curve: PerspectiveOptions.card.moveInEase,
          kind: 'ESSENTIAL'
        });
    }

    private async moveCardToOrigin(): Promise<void> {
        const { x, y } = this.selectedCard.getOriginalPosition();
    
        await playMotion(this.scene, {
            targets: this.selectedCard,
            to: { x, y },
            duration: PerspectiveOptions.card.moveOutDuration,
            curve: PerspectiveOptions.card.moveOutEase,
            kind: 'ESSENTIAL'
        });
        this.selectedCard.resetDepth();
    }
}

export default CardActionPerspective;