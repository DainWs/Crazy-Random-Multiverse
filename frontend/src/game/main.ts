import { Boot } from '@/scenes/Boot';
import { GameOver } from '@/scenes/GameOver';
import { Game as MainGame } from '@/scenes/Game';
import { MainMenu } from '@/scenes/MainMenu';
import { Preloader } from '@/scenes/Preloader';
import { AUTO, Game } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
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
        MainGame,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
