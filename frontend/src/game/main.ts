import { Boot } from '@/game/scenes/Boot';
import { GameOver } from '@/game/scenes/GameOver';
import { Game as MainGame } from '@/game/scenes/Game';
import { MainMenu } from '@/game/scenes/MainMenu';
import { Preloader } from '@/game/scenes/Preloader';
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
