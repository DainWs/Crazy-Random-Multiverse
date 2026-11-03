import { Scene } from 'phaser';
import SessionSystem from '@/core/SessionSystem';

class Boot extends Scene {
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
    }

    async create ()
    {
        await SessionSystem.start();
        this.scene.start('Preloader');
    }
}

export { Boot };