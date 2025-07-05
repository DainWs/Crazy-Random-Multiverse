import { CardView } from "@/game/cards/CardView";
import CalmTargetingOverlay from "@/game/perspectives/overlays/CalmTargetingOverlay";
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

        this.overlay = new CalmTargetingOverlay(scene);
    }

    public async enter() {
        if (this.currentZone) {
            this.overlay.setTargets(this.currentZone);
        }

        await this.moveCardToLeftPanel();
        this.overlay.activate();
    }

    public async exit() {
        this.overlay.deactivate();
        await this.moveCardToOrigin();
    }

    private async moveCardToLeftPanel(): Promise<void> {
        const x = this.scene.cameras.main.x + PerspectiveOptions.card.leftPadding;
        const y = this.scene.cameras.main.y + PerspectiveOptions.card.topPadding +
            (this.scene.cameras.main.height / 2 - this.selectedCard.displayHeight / 2);


        this.scene.tweens.add({
          targets: this.selectedCard,
          x, y,
          duration: PerspectiveOptions.card.moveInDuration,
          ease: PerspectiveOptions.card.moveInEase
        })

        await sleep(PerspectiveOptions.card.moveInDuration);
    }

    private async moveCardToOrigin(): Promise<void> {
        const { x, y } = this.selectedCard.getOriginalPosition();
    
        this.scene.tweens.add({
            targets: this.selectedCard,
            x, y,
            duration: PerspectiveOptions.card.moveOutDuration,
            ease: PerspectiveOptions.card.moveOutEase
        });

        await sleep(PerspectiveOptions.card.moveOutDuration);
    }
}

async function sleep(miliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

export default CardActionPerspective;