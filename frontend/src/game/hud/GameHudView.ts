import type Player from '@/domain/Player';
import type { Point2D, Size2D } from '@/domain/Geometry';
import type { GameScene } from '@/scenes/Game';
import GameHudLayout from '@/game/hud/GameHudLayout';
import StoreSystem from '@/core/StoreSystem';
import { getText } from '@/core/Texts';
import * as Constants from '@/core/Constants';

type HudCallbacks = {
    onPassTurn: () => void;
    onSurrender: () => void;
    onLeave: () => void;
};

/** Shows the round and whose turn it is (UI-3), and the buttons to pass the turn and to surrender. A spectator gets
 * a button to leave instead (UI-8). Surrendering and leaving ask for confirmation (UI-15). */
class GameHudView {
    private readonly scene: GameScene;
    private layout: GameHudLayout;
    private readonly callbacks: HudCallbacks;
    private readonly turnText: Phaser.GameObjects.Text;
    private readonly passTurnButton: Phaser.GameObjects.Text;
    private readonly surrenderButton: Phaser.GameObjects.Text;
    private readonly leaveButton: Phaser.GameObjects.Text;
    private readonly spectatorLabel: Phaser.GameObjects.Text;
    private confirmDialog: Phaser.GameObjects.Container | null = null;
    private stopListening: () => void = () => undefined;
    private enabled = false;
    private spectator = false;
    private zoom: number;
    private screenSize: Size2D;

    public constructor(scene: GameScene, callbacks: HudCallbacks) {
        this.scene = scene;
        this.zoom = this.cameraZoom();
        this.screenSize = this.currentScreenSize();
        this.layout = new GameHudLayout(scene.scale, this.zoom);
        this.callbacks = callbacks;

        this.turnText = this.createText(this.layout.turnTextPosition(), '');

        this.passTurnButton = this.createButton(
            this.layout.passTurnButtonAnchor(),
            getText('ui.game.end_turn'),
            () => this.whenEnabled(callbacks.onPassTurn)
        );

        this.surrenderButton = this.createButton(
            this.layout.surrenderButtonAnchor(this.passTurnButton.height),
            getText('ui.game.surrender'),
            () => this.whenEnabled(this.askToSurrender.bind(this))
        );

        this.leaveButton = this.createButton(
            this.layout.passTurnButtonAnchor(),
            getText('ui.game.leave'),
            this.askToLeave.bind(this)
        );
        this.leaveButton.setVisible(false);

        this.spectatorLabel = this.createText(this.layout.spectatorLabelAnchor(this.leaveButton.height), getText('ui.game.spectating'));
        this.spectatorLabel.setColor(Constants.HUD_SPECTATOR_COLOR);
        this.spectatorLabel.setOrigin(1, 1);
        this.spectatorLabel.setVisible(false);

        for (const element of [this.turnText, this.passTurnButton, this.surrenderButton, this.spectatorLabel]) {
            element.setScrollFactor(0);
            element.setDepth(Constants.HUD_DEPTH);
        }
        this.leaveButton.setScrollFactor(0);
        this.leaveButton.setDepth(Constants.LEAVE_BUTTON_DEPTH);
        this.applyZoom();
        this.listenToPreRender();
    }

    private cameraZoom(): number {
        return this.scene.cameraSystem.getCamera().zoom;
    }

    // The scene events outlive a restart, so the listener goes with the HUD
    private listenToPreRender() {
        const sceneEvents = this.scene.events;
        const onPreRender = () => this.followScreen();
        sceneEvents.on('prerender', onPreRender);
        this.stopListening = () => sceneEvents.off('prerender', onPreRender);
    }

    private currentScreenSize(): Size2D {
        const { width, height } = this.scene.scale;
        return { width, height };
    }

    /** The HUD keeps its place and size when the camera zooms and when the window changes size (UI-3, VIEW-24). */
    private followScreen() {
        const zoom = this.cameraZoom();
        const screenSize = this.currentScreenSize();
        const hasSizeChanged = screenSize.width !== this.screenSize.width || screenSize.height !== this.screenSize.height;
        if (zoom === this.zoom && !hasSizeChanged) {
            return;
        }

        this.zoom = zoom;
        this.screenSize = screenSize;
        this.layout = new GameHudLayout(this.scene.scale, zoom);
        this.applyZoom();
        if (hasSizeChanged) {
            this.closeConfirmDialog();
        }
    }

    /** The HUD stays at the same place and size on the screen at any zoom (UI-3). */
    private applyZoom() {
        const scale = this.layout.scale();
        const turnPosition = this.layout.turnTextPosition();
        const passTurnPosition = this.layout.passTurnButtonAnchor();
        const surrenderPosition = this.layout.surrenderButtonAnchor(this.passTurnButton.height);
        const spectatorLabelPosition = this.layout.spectatorLabelAnchor(this.leaveButton.height);

        this.turnText.setScale(scale).setPosition(turnPosition.x, turnPosition.y);
        this.passTurnButton.setScale(scale).setPosition(passTurnPosition.x, passTurnPosition.y);
        this.surrenderButton.setScale(scale).setPosition(surrenderPosition.x, surrenderPosition.y);
        this.leaveButton.setScale(scale).setPosition(passTurnPosition.x, passTurnPosition.y);
        this.spectatorLabel.setScale(scale).setPosition(spectatorLabelPosition.x, spectatorLabelPosition.y);
        this.applyDialogZoom();
    }

    private applyDialogZoom() {
        const { x, y, scale } = this.layout.dialogTransform();
        this.confirmDialog?.setPosition(x, y).setScale(scale);
    }

    /** Draws the turn indicator and enables the buttons only when the player can act (UI-4). A spectator only gets
     * the button to leave (UI-8). */
    public refresh(canAct: boolean) {
        this.refreshTurnText();
        this.refreshRole();

        if (canAct === this.enabled) {
            return;
        }

        this.enabled = canAct;
        for (const button of [this.passTurnButton, this.surrenderButton]) {
            button.setAlpha(canAct ? 1 : Constants.HUD_DISABLED_ALPHA);
        }
        if (!canAct && !this.spectator) {
            this.closeConfirmDialog();
        }
    }

    public destroy() {
        this.stopListening();
        this.closeConfirmDialog();
        this.turnText.destroy();
        this.passTurnButton.destroy();
        this.surrenderButton.destroy();
        this.leaveButton.destroy();
        this.spectatorLabel.destroy();
    }

    private refreshRole() {
        const spectator = StoreSystem.isPlayerSpectator();
        if (spectator === this.spectator) {
            return;
        }

        this.spectator = spectator;
        this.closeConfirmDialog();
        this.passTurnButton.setVisible(!spectator);
        this.surrenderButton.setVisible(!spectator);
        this.leaveButton.setVisible(spectator);
        this.spectatorLabel.setVisible(spectator);
    }

    private refreshTurnText() {
        const round = StoreSystem.getRound();
        const roundLabel = round === undefined ? '' : `${getText('ui.game.round')} ${round}`;

        const playerWithTurn = StoreSystem.getPlayerWithTurn();
        const isOwnTurn = playerWithTurn?.code === StoreSystem.getPlayer().code;
        const turnLabel = this.turnLabel(playerWithTurn, isOwnTurn);

        this.turnText.setText([roundLabel, turnLabel].filter(Boolean).join(Constants.HUD_TURN_SEPARATOR));
        this.turnText.setColor(isOwnTurn ? Constants.HUD_OWN_TURN_COLOR : Constants.HUD_COLOR);
    }

    private turnLabel(playerWithTurn: Player | undefined, isOwnTurn: boolean): string {
        if (!playerWithTurn) {
            return '';
        }

        return isOwnTurn ? getText('ui.game.your_turn') : `${getText('ui.game.turn_of')} ${playerWithTurn.name}`;
    }

    private whenEnabled(onClick: () => void) {
        if (this.enabled) {
            onClick();
        }
    }

    private createText(position: Point2D, text: string): Phaser.GameObjects.Text {
        return this.scene.add.text(position.x, position.y, text, this.textStyle());
    }

    private createButton(anchor: Point2D, label: string, onClick: () => void): Phaser.GameObjects.Text {
        const button = this.createText(anchor, label);
        button.setBackgroundColor(Constants.HUD_BUTTON_BACKGROUND);
        button.setPadding(Constants.HUD_BUTTON_PADDING);
        button.setOrigin(1, 1);
        button.setInteractive({ useHandCursor: true });
        button.on('pointerup', onClick);
        button.on('pointerover', () => button.setBackgroundColor(Constants.HUD_BUTTON_HOVER_BACKGROUND));
        button.on('pointerout', () => button.setBackgroundColor(Constants.HUD_BUTTON_BACKGROUND));
        return button;
    }

    private askToSurrender() {
        this.askToConfirm('ui.game.surrender_confirm', this.callbacks.onSurrender);
    }

    private askToLeave() {
        this.askToConfirm('ui.game.leave_confirm', this.callbacks.onLeave);
    }

    private askToConfirm(textKey: string, onYes: () => void) {
        if (this.confirmDialog) {
            return;
        }

        const dialog = this.layout.confirmDialog();
        const { veil, panel } = dialog;

        const veilColor = Constants.CONFIRM_VEIL_COLOR;
        const veilAlpha = Constants.CONFIRM_VEIL_ALPHA;
        const veilShape = this.scene.add.rectangle(0, 0, veil.width, veil.height, veilColor, veilAlpha);
        veilShape.setOrigin(0, 0);
        veilShape.setInteractive();

        const panelColor = Constants.CONFIRM_DIALOG_BACKGROUND;
        const panelShape = this.scene.add.rectangle(panel.x, panel.y, panel.width, panel.height, panelColor);
        panelShape.setStrokeStyle(Constants.CONFIRM_DIALOG_BORDER_WIDTH, Constants.CONFIRM_DIALOG_BORDER_COLOR);

        const question = this.createText(dialog.question, getText(textKey));
        question.setOrigin(0.5);

        const yes = this.createDialogButton(dialog.yes, getText('ui.game.confirm_yes'), () => this.confirm(onYes));

        const no = this.createDialogButton(dialog.no, getText('ui.game.confirm_no'), () => this.closeConfirmDialog());

        this.confirmDialog = this.scene.add.container(0, 0, [veilShape, panelShape, question, yes, no]);
        this.confirmDialog.setScrollFactor(0);
        this.confirmDialog.setDepth(Constants.CONFIRM_DIALOG_DEPTH);
        this.applyDialogZoom();
    }

    private confirm(onYes: () => void) {
        this.closeConfirmDialog();
        onYes();
    }

    private createDialogButton(position: Point2D, label: string, onClick: () => void): Phaser.GameObjects.Text {
        const button = this.createButton(position, label, onClick);
        button.setOrigin(0.5);
        button.setScrollFactor(0);
        return button;
    }

    private closeConfirmDialog() {
        this.confirmDialog?.destroy();
        this.confirmDialog = null;
    }

    private textStyle(): Phaser.Types.GameObjects.Text.TextStyle {
        return { fontSize: Constants.HUD_FONT_SIZE, color: Constants.HUD_COLOR };
    }
}

export default GameHudView;
