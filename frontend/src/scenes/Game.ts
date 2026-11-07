import type { GameChange } from '@/core/StoreSystem';
import CardController from '@/controllers/CardController';
import CardViewFactory from '@/controllers/CardViewFactory';
import GlobalCardTooltipView from '@/game/cards/tooltip/GlobalCardTooltipView';
import HandController from '@/controllers/HandController';
import GameHudView from '@/game/hud/GameHudView';
import StoreSystem from '@/core/StoreSystem';
import ZoneView from '@/game/zone/ZoneView';
import ZoneViewFactory from '@/game/zone/ZoneViewFactory';
import { Scene } from 'phaser';
import * as Constants from '@/core/Constants';
import { getText } from '@/core/Texts';
import CameraSystem from '@/core/CameraSystem';
import BattlefieldView from '@/game/battlefield/BattlefieldView';
import CombatantView from '@/game/cards/CombatantView';

class GameScene extends Scene {
    public camera: Phaser.Cameras.Scene2D.Camera;
    public background: Phaser.GameObjects.Image;

    public readonly cameraSystem: CameraSystem;
    public readonly cardController: CardController;
    public readonly handController: HandController;

    private cardTooltipView: GlobalCardTooltipView;
    private hudView: GameHudView;
    private rejectionText?: Phaser.GameObjects.Text;
    private battlefieldContainer: Phaser.GameObjects.Container;
    public zones: ZoneView[];

    private readonly storeChangeHandlers: Record<GameChange, () => void> = {
        GAME_UPDATED: () => this.renderZones(),
        HAND_RESTORED: () => this.renderHand(),
        HAND_CHANGED: () => this.handController.syncCards(StoreSystem.getPlayerHand())
    };

    public constructor() {
        super('Game');

        this.cameraSystem = new CameraSystem();

        this.cardController = new CardController((key) => this.showRejection(key));
        this.handController = new HandController(this);
    }

    public init() {
        const { width, height } = this.scale;
        this.battlefieldContainer = this.add.container(width / 2, height * 0.3);
        this.cardTooltipView = new GlobalCardTooltipView(this);

        this.cameraSystem.initialize(this);
        this.cameraSystem.setupBattlefieldCamera(width / 2, height / 2);

        this.handController.init();
    }

    public create() {
        this.input.dragDistanceThreshold = Constants.DRAG_DISTANCE_THRESHOLD;
        this.input.dragTimeThreshold = Constants.DRAG_TIME_THRESHOLD;
        this.input.setPollAlways();

        this.hudView = new GameHudView(this, {
            onPassTurn: () => this.cardController.passTurn(),
            onSurrender: () => this.cardController.surrender()
        });
        this.renderAll();

        const stopListening = StoreSystem.onChange((change) => this.storeChangeHandlers[change]());
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, stopListening);
    }

    private renderAll() {
        this.renderHand();
        this.renderZones();
    }

    private renderHand() {
        this.handController.restoreCards(StoreSystem.getPlayerHand());
    }

    private renderZones() {
        this.zones = [];
        this.battlefieldContainer.removeAll(true);

        const battlefield = StoreSystem.getBattlefield();
        const battlefieldView = new BattlefieldView(this, battlefield);
        this.battlefieldContainer.add(battlefieldView);

        const zoneViews = ZoneViewFactory.createAllZoneViews(this, battlefield);
        for (const zoneView of zoneViews) {
            this.zones.push(zoneView);
            this.battlefieldContainer.add(zoneView);
            this.showCombatants(zoneView);
        }
    }

    private showCombatants(zoneView: ZoneView) {
        for (const slotView of zoneView.getSlots().flat()) {
            const combatant = slotView.zoneSlot.combatant;
            if (combatant) {
                slotView.setCard(CardViewFactory.createCardView(this, combatant) as CombatantView);
            }
        }
    }

    public changeScene() {
        this.scene.start('GameOver');
    }

    override update(time: number, delta: number): void {
        super.update(time, delta);
        this.handController.update();
        this.hudView.refresh(this.cardController.canAct());

        const playerZone = StoreSystem.getPlayerZone();
        if (!playerZone.isAlive()) {
            this.scene.start('GameOver');
            return;
        }

        const player = StoreSystem.getPlayer();
        const othersZones = StoreSystem.getZones().filter(zone => zone.owner !== player);
        if (othersZones.length > 0 && othersZones.every(zone => !zone.isAlive())) {
            this.scene.start('GameOver');
            return;
        }
    }

    /** Shows briefly why the server rejected an action (UI-6). */
    public showRejection(key: string) {
        this.rejectionText?.destroy();

        const centerX = this.scale.width / 2;
        const message = getText(key);
        const style = { fontSize: Constants.REJECTION_MESSAGE_FONT_SIZE, color: Constants.REJECTION_MESSAGE_COLOR };
        const rejectionText = this.add.text(centerX, Constants.REJECTION_MESSAGE_TOP_OFFSET, message, style);
        rejectionText.setOrigin(0.5, 0.5);
        rejectionText.setScrollFactor(0);
        rejectionText.setDepth(Constants.REJECTION_MESSAGE_DEPTH);

        this.rejectionText = rejectionText;
        this.time.delayedCall(Constants.REJECTION_MESSAGE_DURATION_MS, () => rejectionText.destroy());
    }

    public getCardTooltipView(): GlobalCardTooltipView {
        return this.cardTooltipView;
    }
}

export { GameScene }