import type Player from '@/domain/Player';
import type { Point2D, Size2D } from '@/domain/Geometry';
import type { GameScene } from '@/scenes/Game';
import GameHudLayout from '@/game/hud/GameHudLayout';
import SessionSystem from '@/core/SessionSystem';
import StoreSystem from '@/core/StoreSystem';
import { getText } from '@/core/Texts';
import type { ButtonRole } from '@/game/hud/HudSkin';
import { accentAlpha, accentColor, createButton, createFocusFrame, createPanel, createText, panelBackground } from '@/game/hud/HudPieces';
import * as Constants from '@/core/Constants';
import { paletteFill, paletteText } from '@/game/utils/Palette';

type DialogButton = 'YES' | 'NO';

/** The keys that move the focus between the buttons of the confirmation dialog (UI-32). */
const DIALOG_FOCUS_KEYS = new Set(['Tab', 'ArrowLeft', 'ArrowRight']);
const DIALOG_PRESS_KEYS = new Set(['Enter', 'NumpadEnter']);
const DIALOG_CANCEL_KEY = 'Escape';

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
    private dialogButtons = new Map<DialogButton, Phaser.GameObjects.Text>();
    private dialogActions = new Map<DialogButton, () => void>();
    private focusFrame: Phaser.GameObjects.Rectangle | null = null;
    private focusedButton: DialogButton = 'NO';
    private readonly handledKeys = new WeakSet<KeyboardEvent>();
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

        this.turnText = this.createLabel(this.layout.turnTextPosition(), '');
        this.turnText.setBackgroundColor(panelBackground('HUD'));
        this.turnText.setPadding(Constants.HUD_BUTTON_PADDING);

        this.passTurnButton = this.createHudButton(
            'PRIMARY',
            this.layout.passTurnButtonAnchor(),
            getText('ui.game.end_turn'),
            () => this.whenEnabled(callbacks.onPassTurn)
        );

        this.surrenderButton = this.createHudButton(
            'DESTRUCTIVE',
            this.layout.surrenderButtonAnchor(),
            getText('ui.game.surrender'),
            () => this.whenEnabled(this.askToSurrender.bind(this))
        );
        this.surrenderButton.setOrigin(0, 1);

        this.leaveButton = this.createHudButton(
            'NEUTRAL',
            this.layout.passTurnButtonAnchor(),
            getText('ui.game.leave'),
            this.askToLeave.bind(this)
        );
        this.leaveButton.setVisible(false);

        const spectatorAnchor = this.layout.spectatorLabelAnchor(this.leaveButton.height);
        this.spectatorLabel = createText(this.scene, 'LABEL', {}, getText('ui.game.spectating'));
        this.spectatorLabel.setPosition(spectatorAnchor.x, spectatorAnchor.y);
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
        this.scene.input.keyboard?.on('keydown', this.onKeyDown, this);
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
        const surrenderPosition = this.layout.surrenderButtonAnchor();
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
            button.setAlpha(canAct ? 1 : accentAlpha('DISABLED'));
        }
        if (!canAct && !this.spectator) {
            this.closeConfirmDialog();
        }
    }

    public destroy() {
        this.stopListening();
        this.scene.input.keyboard?.off('keydown', this.onKeyDown, this);
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
        this.turnText.setColor(isOwnTurn ? accentColor('LOCAL_TURN') : paletteText('HUD_TEXT'));
    }

    private turnLabel(playerWithTurn: Player | undefined, isOwnTurn: boolean): string {
        if (!playerWithTurn) {
            return '';
        }

        return isOwnTurn ? getText('ui.game.your_turn') : `${getText('ui.game.turn_of')} ${playerWithTurn.name}`;
    }

    /** The keys of the HUD: Space ends the turn, and the dialog takes every key while it is open (UI-32). Phaser can deliver
     * the same event of the browser more than once, so each one is handled once (`PHASER4-SPECS.md`). */
    private onKeyDown(event: KeyboardEvent) {
        if (this.handledKeys.has(event)) {
            return;
        }

        this.handledKeys.add(event);
        if (this.confirmDialog) {
            this.onDialogKey(event);
            return;
        }

        if (event.code !== Constants.END_TURN_KEY_CODE) {
            return;
        }

        event.preventDefault();
        if (event.repeat || this.spectator || SessionSystem.connectionNoticeKey.value) {
            return;
        }

        this.whenEnabled(this.callbacks.onPassTurn);
    }

    private onDialogKey(event: KeyboardEvent) {
        if (DIALOG_FOCUS_KEYS.has(event.code)) {
            event.preventDefault();
            this.focusDialogButton(this.focusedButton === 'NO' ? 'YES' : 'NO');
        } else if (DIALOG_PRESS_KEYS.has(event.code)) {
            event.preventDefault();
            this.dialogActions.get(this.focusedButton)?.();
        } else if (event.code === DIALOG_CANCEL_KEY) {
            event.preventDefault();
            this.dialogActions.get('NO')?.();
        }
    }

    private focusDialogButton(button: DialogButton) {
        const target = this.dialogButtons.get(button)!;
        const margin = 2 * Constants.FOCUS_FRAME_MARGIN;

        this.focusedButton = button;
        this.focusFrame?.setPosition(target.x, target.y);
        this.focusFrame?.setSize(target.width + margin, target.height + margin);
    }

    private whenEnabled(onClick: () => void) {
        if (this.enabled) {
            onClick();
        }
    }

    private createLabel(position: Point2D, text: string): Phaser.GameObjects.Text {
        const label = createText(this.scene, 'BODY', {}, text);
        label.setPosition(position.x, position.y);

        return label;
    }

    private createHudButton(role: ButtonRole, anchor: Point2D, label: string, onClick: () => void): Phaser.GameObjects.Text {
        const button = createButton(this.scene, role, label);
        button.setPosition(anchor.x, anchor.y);
        button.setOrigin(1, 1);
        button.on('pointerup', onClick);

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

        const veilColor = paletteFill('SCREEN_VEIL');
        const veilAlpha = Constants.CONFIRM_VEIL_ALPHA;
        const veilShape = this.scene.add.rectangle(0, 0, veil.width, veil.height, veilColor, veilAlpha);
        veilShape.setOrigin(0, 0);
        veilShape.setInteractive();

        const panelShape = createPanel(this.scene, 'HUD');
        panelShape.setPosition(panel.x, panel.y);
        panelShape.setSize(panel.width, panel.height);

        const question = this.createLabel(dialog.question, getText(textKey));
        question.setOrigin(0.5);

        this.dialogActions = new Map<DialogButton, () => void>([
            ['YES', () => this.confirm(onYes)],
            ['NO', () => this.closeConfirmDialog()]
        ]);

        const yes = this.createDialogButton(dialog.yes, getText('ui.game.confirm_yes'), this.dialogActions.get('YES')!);

        const no = this.createDialogButton(dialog.no, getText('ui.game.confirm_no'), this.dialogActions.get('NO')!);

        this.dialogButtons = new Map<DialogButton, Phaser.GameObjects.Text>([['YES', yes], ['NO', no]]);

        this.focusFrame = createFocusFrame(this.scene);

        this.confirmDialog = this.scene.add.container(0, 0, [veilShape, panelShape, question, yes, no, this.focusFrame]);
        this.confirmDialog.setScrollFactor(0);
        this.confirmDialog.setDepth(Constants.CONFIRM_DIALOG_DEPTH);
        this.focusDialogButton('NO');
        this.applyDialogZoom();
    }

    private confirm(onYes: () => void) {
        this.closeConfirmDialog();
        onYes();
    }

    private createDialogButton(position: Point2D, label: string, onClick: () => void): Phaser.GameObjects.Text {
        const button = this.createHudButton('NEUTRAL', position, label, onClick);
        button.setOrigin(0.5);
        button.setScrollFactor(0);
        return button;
    }

    private closeConfirmDialog() {
        this.confirmDialog?.destroy();
        this.confirmDialog = null;
        this.focusFrame = null;
    }
}

export default GameHudView;
