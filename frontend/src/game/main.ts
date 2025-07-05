import { Boot } from '@/scenes/Boot';
import { GameOver } from '@/scenes/GameOver';
import { GameLoad } from '@/scenes/GameLoad';
import { GameScene } from '@/scenes/Game';
import { MainMenu } from '@/scenes/MainMenu';
import { Preloader } from '@/scenes/Preloader';
import { AUTO, Game } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    pixelArt: true,
    transparent: true,
    scene: [
        Boot,
        Preloader,
        MainMenu,
        GameLoad,
        GameScene,
        GameOver
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
