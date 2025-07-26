import { CardView } from "@/game/cards/CardView";
import CalmTargetingOverlay, { TargetArea } from "@/game/perspectives/overlays/CalmTargetingOverlay";
import Perspective from "@/game/perspectives/Perspective";
import ZoneView from "@/game/zone/ZoneView";

type SelectedCard = CardView
type TargetZone = ZoneView;

const PerspectiveOptions = {
    card: {
        topPadding: 0,
        leftPadding: 150,
        moveInDuration: 300,
        moveInEase: 'Cubic.easeOut',
        moveOutDuration: 200,
        moveOutEase: 'Cubic.easeIn'
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
        console.log("wow " + this.currentZone)
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
        this.scene.tweens.add({
          targets: this.selectedCard,
          x, y,
          duration: PerspectiveOptions.card.moveInDuration,
          ease: PerspectiveOptions.card.moveInEase,
          persist: false
        })

        await sleep(PerspectiveOptions.card.moveInDuration);
    }

    private async moveCardToOrigin(): Promise<void> {
        const { x, y } = this.selectedCard.getOriginalPosition();
    
        this.scene.tweens.add({
            targets: this.selectedCard,
            x, y,
            duration: PerspectiveOptions.card.moveOutDuration,
            ease: PerspectiveOptions.card.moveOutEase,
            persist: false
        });

        await sleep(PerspectiveOptions.card.moveOutDuration);
        this.selectedCard.resetDepth();
    }
}

async function sleep(miliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

export default CardActionPerspective;