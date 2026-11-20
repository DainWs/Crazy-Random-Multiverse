import type { GameChange, GameChangeEvent } from '@/core/StoreSystem';
import type Battlefield from '@/domain/Battlefield';
import { watch } from 'vue';
import type { PlayerCode } from '@/domain/Player';
import CardController from '@/controllers/CardController';
import CardViewFactory from '@/controllers/CardViewFactory';
import GlobalCardTooltipView from '@/game/cards/tooltip/GlobalCardTooltipView';
import HandController from '@/controllers/HandController';
import PartyController from '@/controllers/PartyController';
import GameHudView from '@/game/hud/GameHudView';
import AnimationSystem from '@/core/AnimationSystem';
import StoreSystem from '@/core/StoreSystem';
import ResourceSystem from '@/core/ResourceSystem';
import ZoneView from '@/game/zone/ZoneView';
import ZoneViewFactory from '@/game/zone/ZoneViewFactory';
import CardValueLabelsView from '@/game/zone/CardValueLabelsView';
import SettingsSystem, { CARD_VALUES } from '@/core/SettingsSystem';
import Phaser, { Scene } from 'phaser';
import * as Constants from '@/core/Constants';
import { getText } from '@/core/Texts';
import { createText } from '@/game/hud/HudPieces';
import { paletteRgba } from '@/game/utils/Palette';
import EffectSettings from '@/core/EffectSettings';
import CameraSystem from '@/core/CameraSystem';
import BattlefieldView from '@/game/battlefield/BattlefieldView';
import GameResultView from '@/game/result/GameResultView';
import CardClickHandler from '@/core/interactions/CardClickHandler';
import { playCombat } from '@/core/visual_effects/CombatAnimations';
import { findLeaders, hideLeaders, playLeaderIntro } from '@/core/visual_effects/LeaderIntro';
import type { BoardTurn } from '@/core/visual_effects/TurnNotices';
import { describeNotices, playNotice } from '@/core/visual_effects/TurnNotices';
import SessionSystem from '@/core/SessionSystem';
import { playLoadTransition } from '@/core/visual_effects/LoadTransition';
import { BOARD_ORIGIN_HEIGHT_RATIO, REFERENCE_SCREEN, calculateScreenFit, calculateScreenFixedTransform } from '@/core/cameras/CameraCalculations';

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
    private isLeaderIntroPending = false;
    /** The round and the turn of the last board queued, which is what the next one is compared with to announce a change (VIEW-15). */
    private queuedTurn: BoardTurn = {};
    private battlefieldContainer: Phaser.GameObjects.Container;
    private cardValueLabels?: CardValueLabelsView;
    public zones: ZoneView[];

    private readonly storeChangeHandlers: Record<GameChange, (event: GameChangeEvent) => void> = {
        GAME_UPDATED: (event) => this.queueZones(event),
        HAND_RESTORED: () => this.renderHand(),
        HAND_CHANGED: () => this.syncHand(),
        GAME_ENDED: () => this.queueResult()
    };

    public constructor() {
        super('Game');

        this.cameraSystem = new CameraSystem();

        this.cardController = new CardController((key) => this.showRejection(key));
        this.handController = new HandController(this);
    }

    public init() {
        const { width, height } = REFERENCE_SCREEN;
        this.battlefieldContainer = this.add.container(width / 2, height * BOARD_ORIGIN_HEIGHT_RATIO);
        this.cardTooltipView = new GlobalCardTooltipView(this);

        this.cameraSystem.initialize(this);
        if (EffectSettings.accessibleModeIsOn()) {
            this.cameras.main.setBackgroundColor(paletteRgba('SCREEN_VEIL', Constants.GAME_BACKGROUND_DIM_ALPHA));
        }
        this.cameraSystem.setupBattlefieldCamera(width / 2, height / 2, this.battlefieldContainer);

        this.handController.init();
    }

    public create() {
        playLoadTransition(this);
        this.input.dragDistanceThreshold = Constants.DRAG_DISTANCE_THRESHOLD;
        this.input.dragTimeThreshold = Constants.DRAG_TIME_THRESHOLD;
        this.input.setPollAlways();

        this.hudView = new GameHudView(this, {
            onPassTurn: () => this.cardController.passTurn(),
            onSurrender: () => this.cardController.surrender(),
            onLeave: () => this.leaveGame()
        });
        this.renderAll();
        this.queuedTurn = { round: StoreSystem.getRound(), playerWithTurn: StoreSystem.getPlayerWithTurn()?.code };
        this.isLeaderIntroPending = false;
        if (SessionSystem.takeLeaderIntro()) {
            this.queueLeaderIntro();
        }
        this.resultView = undefined;
        if (StoreSystem.getResult()) {
            this.showResult();
        }

        this.scale.on(Phaser.Scale.Events.RESIZE, this.onResize, this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off(Phaser.Scale.Events.RESIZE, this.onResize, this));

        const stopListening = StoreSystem.onChange((event) => this.storeChangeHandlers[event.change](event));
        const stopWatchingSettings = watch(SettingsSystem.cardValuesOn, () => this.showCardValueLabels());
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, stopWatchingSettings);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, stopListening);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => AnimationSystem.clear());
    }

    /** The hand, the HUD and the panel follow the screen on their own every frame, but the camera has to frame the board again (VIEW-24). */
    private onResize() {
        this.cameraSystem.fitToScreen();
    }

    /** The leaders are placed one after the other before anything else is animated, and the first cards wait for them (VIEW-12, VIEW-8). */
    private queueLeaderIntro() {
        const playerOrder = StoreSystem.getZones().map((zone) => zone.owner.code);
        const leaders = findLeaders(this.zones, playerOrder);
        hideLeaders(leaders);

        this.isLeaderIntroPending = true;
        this.showCardValueLabels();
        AnimationSystem.enqueue(async () => {
            await playLeaderIntro(this, leaders);
            this.isLeaderIntroPending = false;
            this.showCardValueLabels();
        });
    }

    private syncHand() {
        if (this.isLeaderIntroPending) {
            AnimationSystem.enqueue(async () => this.handController.syncCards(StoreSystem.getPlayerHand()));
        } else {
            this.handController.syncCards(StoreSystem.getPlayerHand());
        }
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

        AnimationSystem.enqueue(async () => this.renderZones(snapshot.battlefield, snapshot.playerWithTurn));

        const next = { round: snapshot.round, playerWithTurn: snapshot.playerWithTurn };
        const players = snapshot.zones.map((zone) => zone.owner);
        for (const text of describeNotices(this.queuedTurn, next, StoreSystem.getPlayer().code, players)) {
            AnimationSystem.enqueue(() => playNotice(this, text));
        }
        this.queuedTurn = next;
    }


    /** The result covers the board only after the last animation, so it does not hide it (WIN-4). */
    private queueResult() {
        AnimationSystem.enqueue(async () => this.showResult());
    }

    private renderZones(
        battlefield: Battlefield = StoreSystem.getBattlefield(),
        playerWithTurn: PlayerCode | undefined = StoreSystem.getPlayerWithTurn()?.code
    ) {
        CardClickHandler.cancelTargeting();
        this.zones = [];
        this.cardValueLabels = undefined;
        this.battlefieldContainer.removeAll(true);

        const battlefieldView = new BattlefieldView(this, battlefield);
        this.battlefieldContainer.add(battlefieldView);

        const zoneViews = ZoneViewFactory.createAllZoneViews(this, battlefield, playerWithTurn);
        ResourceSystem.trackBoard(zoneViews.flatMap((zoneView) => this.combatantsOf(zoneView)).map((combatant) => combatant.getImage()));
        for (const zoneView of zoneViews) {
            this.zones.push(zoneView);
            this.battlefieldContainer.add(zoneView);
            this.showCombatants(zoneView);
        }

        this.showCardValueLabels();
    }

    /** The values the player turned on are drawn outside the cards, over the board (UI-33, VIEW-46). */
    private showCardValueLabels() {
        this.cardValueLabels?.destroy();
        this.cardValueLabels = undefined;

        const values = CARD_VALUES.filter((cardValue) => SettingsSystem.isCardValueOn(cardValue));
        if (values.length === 0) {
            return;
        }

        const labels = new CardValueLabelsView(this, this.zones, values, this.isLeaderIntroPending);
        labels.applyScale(this.cardValueUnitsPerPixel());
        this.battlefieldContainer.add(labels);
        this.cardValueLabels = labels;
    }

    /** A label is 18 px on the screen at the reference size, and the zoom of the camera shrinks or grows what it draws (VIEW-46, VIEW-24). */
    private cardValueUnitsPerPixel(): number {
        return calculateScreenFit(this.scale) / this.cameraSystem.getCamera().zoom;
    }

    private combatantsOf(zoneView: ZoneView) {
        return zoneView.getSlots().flat().flatMap((slotView) => slotView.zoneSlot.combatant ?? []);
    }

    private showCombatants(zoneView: ZoneView) {
        for (const slotView of zoneView.getSlots().flat()) {
            const combatant = slotView.zoneSlot.combatant;
            if (combatant) {
                slotView.setCard(CardViewFactory.createCombatantView(this, combatant));
            }
        }
    }

    override update(time: number, delta: number): void {
        super.update(time, delta);
        this.handController.update();
        this.updateCardValueLabels();
        const canAct = this.cardController.canAct();
        this.hudView.refresh(canAct, canAct && StoreSystem.hasNothingLeftToDo());
    }

    private updateCardValueLabels() {
        const unitsPerPixel = this.cardValueUnitsPerPixel();
        if (this.cardValueLabels && this.cardValueLabels.getUnitsPerPixel() !== unitsPerPixel) {
            this.cardValueLabels.applyScale(unitsPerPixel);
        }
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

    /** A spectator leaves the game and the party (SPEC-3). */
    private async leaveGame() {
        const errorKey = await PartyController.leaveGame();
        if (errorKey) {
            this.showRejection(errorKey);
        }
    }

    /** Shows briefly why the server rejected an action (UI-6). */
    public showRejection(key: string) {
        this.rejectionText?.destroy();

        const { x, y, scale } = calculateScreenFixedTransform(this.scale.width, this.scale.height, this.cameraSystem.getCamera().zoom);
        const centerX = x + (this.scale.width / 2) * scale;
        const message = getText(key);
        const rejectionText = createText(this, 'BODY', { fontSize: Constants.REJECTION_MESSAGE_FONT_SIZE, color: 'REJECTION_TEXT' }, message);
        rejectionText.setPosition(centerX, y + Constants.REJECTION_MESSAGE_TOP_OFFSET * scale);
        rejectionText.setOrigin(0.5, 0.5);
        rejectionText.setScale(scale);
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