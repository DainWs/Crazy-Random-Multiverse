import StoreSystem from '@/core/StoreSystem';

class GameOver extends Phaser.Scene {
    private camera: Phaser.Cameras.Scene2D.Camera;
    private background: Phaser.GameObjects.Image;
    private gameOverText : Phaser.GameObjects.Text;

    private readonly isWinner: boolean;

    public constructor () {
        super('GameOver');

        const playerZone = StoreSystem.getPlayerZone();
        this.isWinner = (playerZone.health > 0);
    }

    public create () {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        if (this.isWinner) {
            this.gameOverText = this.getWinnerText();
        } else {
            this.gameOverText = this.getLoserText();
        }

        this.children.add(this.gameOverText);
        this.events.emit('current-scene-ready', this);
    }

    private getWinnerText(): Phaser.GameObjects.Text {
        const winnerOptions = {
            fontFamily: 'Arial Black', fontSize: 38, color: '#00ff00',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        };
        const winnerText = this.add.text(512, 460, 'Winner!!', winnerOptions);
        winnerText.setOrigin(0.5)
        winnerText.setDepth(100);
        return winnerText;
    }

    private getLoserText(): Phaser.GameObjects.Text {
        const winnerOptions = {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        };
        const winnerText = this.add.text(512, 460, 'Game over', winnerOptions);
        winnerText.setOrigin(0.5)
        winnerText.setDepth(100);
        return winnerText;
    }

    public changeScene() {
        this.scene.start('MainMenu');
    }
}

export { GameOver };