import type { GameScene } from "@/scenes/Game";
import StoreSystem from "@/core/StoreSystem";
import { getText } from "@/core/Texts";
import * as Constants from "@/core/Constants";

type HudCallbacks = {
    onPassTurn: () => void;
    onSurrender: () => void;
};

/** Shows the round and whose turn it is (UI-3), and the buttons to pass the turn and to surrender, which ask for confirmation (UI-15). */
class GameHudView {
    private readonly scene: GameScene;
    private readonly turnText: Phaser.GameObjects.Text;
    private readonly passTurnButton: Phaser.GameObjects.Text;
    private readonly surrenderButton: Phaser.GameObjects.Text;
    private confirmDialog: Phaser.GameObjects.Container | null = null;
    private enabled = false;

    public constructor(scene: GameScene, callbacks: HudCallbacks) {
        this.scene = scene;
        const { width, height } = scene.scale;

        this.turnText = scene.add.text(Constants.HUD_MARGIN, Constants.HUD_MARGIN, "", this.textStyle());
        this.passTurnButton = this.createButton(width - Constants.HUD_MARGIN, height - Constants.HUD_MARGIN, getText("ui.game.end_turn"), () => this.enabled && callbacks.onPassTurn());
        const surrenderY = this.passTurnButton.y - this.passTurnButton.height - Constants.HUD_BUTTON_GAP;
        this.surrenderButton = this.createButton(width - Constants.HUD_MARGIN, surrenderY, getText("ui.game.surrender"), () => this.enabled && this.askToSurrender(callbacks.onSurrender));

        for (const element of [this.turnText, this.passTurnButton, this.surrenderButton]) {
            element.setScrollFactor(0);
            element.setDepth(Constants.HUD_DEPTH);
        }
    }

    /** Draws the turn indicator and enables the buttons only when the player can act (UI-4). */
    public refresh(canAct: boolean) {
        this.refreshTurnText();
        if (canAct === this.enabled) {
            return;
        }

        this.enabled = canAct;
        for (const button of [this.passTurnButton, this.surrenderButton]) {
            button.setAlpha(canAct ? 1 : Constants.HUD_DISABLED_ALPHA);
        }
        if (!canAct) {
            this.closeConfirmDialog();
        }
    }

    public destroy() {
        this.closeConfirmDialog();
        this.turnText.destroy();
        this.passTurnButton.destroy();
        this.surrenderButton.destroy();
    }

    private refreshTurnText() {
        const round = StoreSystem.getRound();
        const roundLabel = round === undefined ? "" : `${getText("ui.game.round")} ${round}`;
        const playerWithTurn = StoreSystem.getPlayerWithTurn();
        const isOwnTurn = playerWithTurn?.code === StoreSystem.getPlayer().code;
        const turnLabel = !playerWithTurn ? "" : isOwnTurn ? getText("ui.game.your_turn") : `${getText("ui.game.turn_of")} ${playerWithTurn.name}`;

        this.turnText.setText([roundLabel, turnLabel].filter(Boolean).join(" · "));
        this.turnText.setColor(isOwnTurn ? Constants.HUD_OWN_TURN_COLOR : Constants.HUD_COLOR);
    }

    private createButton(rightX: number, bottomY: number, label: string, onClick: () => void): Phaser.GameObjects.Text {
        const style = { ...this.textStyle(), backgroundColor: Constants.HUD_BUTTON_BACKGROUND, padding: Constants.HUD_BUTTON_PADDING };
        const button = this.scene.add.text(rightX, bottomY, label, style);
        button.setOrigin(1, 1);
        button.setInteractive({ useHandCursor: true });
        button.on("pointerup", onClick);
        return button;
    }

    private askToSurrender(onConfirm: () => void) {
        if (this.confirmDialog) {
            return;
        }

        const { width, height } = this.scene.scale;
        const { width: dialogWidth, height: dialogHeight } = Constants.CONFIRM_DIALOG_SIZE;
        const veil = this.scene.add.rectangle(0, 0, width, height, 0x000000, Constants.CONFIRM_VEIL_ALPHA).setOrigin(0, 0).setInteractive();
        const panel = this.scene.add.rectangle(width / 2, height / 2, dialogWidth, dialogHeight, Constants.CONFIRM_DIALOG_BACKGROUND);
        const question = this.scene.add.text(width / 2, height / 2 - dialogHeight / 4, getText("ui.game.surrender_confirm"), this.textStyle()).setOrigin(0.5);
        const buttonY = height / 2 + dialogHeight / 4;
        const yes = this.createDialogButton(width / 2 - dialogWidth / 4, buttonY, getText("ui.game.confirm_yes"), () => {
            this.closeConfirmDialog();
            onConfirm();
        });
        const no = this.createDialogButton(width / 2 + dialogWidth / 4, buttonY, getText("ui.game.confirm_no"), () => this.closeConfirmDialog());

        this.confirmDialog = this.scene.add.container(0, 0, [veil, panel, question, yes, no]);
        this.confirmDialog.setScrollFactor(0);
        this.confirmDialog.setDepth(Constants.HUD_DEPTH + 1);
    }

    private createDialogButton(x: number, y: number, label: string, onClick: () => void): Phaser.GameObjects.Text {
        const button = this.createButton(x, y, label, onClick);
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
