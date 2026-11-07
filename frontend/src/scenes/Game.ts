import type { GameChange, GameChangeEvent } from '@/core/StoreSystem';
import type Battlefield from '@/domain/Battlefield';
import CardController from '@/controllers/CardController';
import CardViewFactory from '@/controllers/CardViewFactory';
import GlobalCardTooltipView from '@/game/cards/tooltip/GlobalCardTooltipView';
import HandController from '@/controllers/HandController';
import GameHudView from '@/game/hud/GameHudView';
import AnimationSystem from '@/core/AnimationSystem';
import StoreSystem from '@/core/StoreSystem';
import ZoneView from '@/game/zone/ZoneView';
import ZoneViewFactory from '@/game/zone/ZoneViewFactory';
import { Scene } from 'phaser';
import * as Constants from '@/core/Constants';
import { getText } from '@/core/Texts';
import CameraSystem from '@/core/CameraSystem';
import BattlefieldView from '@/game/battlefield/BattlefieldView';
import CombatantView from '@/game/cards/CombatantView';
import GameResultView from '@/game/result/GameResultView';
import CardClickHandler from '@/core/interactions/CardClickHandler';
import { playCombat } from '@/core/visual_effects/CombatAnimations';

class GameScene extends Scene {
    public camera: Phaser.Cameras.Scene2D.Camera;
    public background: Phaser.GameObjects.Image;

    public readonly cameraSystem: CameraSystem;
    public readonly cardController: CardController;
    public readonly handController: HandController;

    private cardTooltipView: GlobalCardTooltipView;
    private hudView: GameHudView;
    private rejectionText?: Phaser.GameObjects.Text;
    private resultView?: GameResultView;
    private battlefieldContainer: Phaser.GameObjects.Container;
    public zones: ZoneView[];

    private readonly storeChangeHandlers: Record<GameChange, (event: GameChangeEvent) => void> = {
        GAME_UPDATED: (event) => this.queueZones(event),
        HAND_RESTORED: () => this.renderHand(),
        HAND_CHANGED: () => this.handController.syncCards(StoreSystem.getPlayerHand()),
        GAME_ENDED: () => this.queueResult()
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
        this.resultView = undefined;
        if (StoreSystem.getResult()) {
            this.showResult();
        }

        const stopListening = StoreSystem.onChange((event) => this.storeChangeHandlers[event.change](event));
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, stopListening);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => AnimationSystem.clear());
    }

    private renderAll() {
        this.renderHand();
        this.renderZones();
    }

    private renderHand() {
        this.handController.restoreCards(StoreSystem.getPlayerHand());
    }

    /** The board of an event is drawn when the animations of the earlier events end, so each state is shown in order (CON-12, UI-4). */
    private queueZones({ snapshot, combat }: GameChangeEvent) {
        if (combat) {
            AnimationSystem.enqueue(() => playCombat(this, combat));
        }

        AnimationSystem.enqueue(async () => this.renderZones(snapshot.battlefield));
    }


    /** The result covers the board only after the last animation, so it does not hide it (WIN-4). */
    private queueResult() {
        AnimationSystem.enqueue(async () => this.showResult());
    }

    private renderZones(battlefield: Battlefield = StoreSystem.getBattlefield()) {
        CardClickHandler.cancelTargeting();
        this.zones = [];
        this.battlefieldContainer.removeAll(true);

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

    override update(time: number, delta: number): void {
        super.update(time, delta);
        this.handController.update();
        this.hudView.refresh(this.cardController.canAct());
    }

    /** Shows the result over the board, or updates it when the winner arrives (WIN-4). */
    private showResult() {
        const result = StoreSystem.getResult()!;

        if (this.resultView) {
            this.resultView.showResult(result);
        } else {
            this.resultView = new GameResultView(this, result);
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