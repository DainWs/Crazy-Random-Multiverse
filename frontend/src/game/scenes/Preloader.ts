import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        
        this.load.image('logo', 'logo.png');
        
        this.load.image('statistic-icon_unknown', 'statistic-icon_unknown.png');
        this.load.image('statistic-icon_true_damage', 'true_sword.png');
        this.load.image('statistic-icon_physical_damage', 'sword.png');
        this.load.image('statistic-icon_magic_damage', 'staff.png');
        this.load.image('statistic-icon_physical_armor', 'shield.png');
        this.load.image('statistic-icon_magic_armor', 'magic_shield.png');
        this.load.image('statistic-icon_health', 'hearth.png');

        this.load.image('card', 'card.png');
        this.load.image('common-card', 'card-common.png');
        this.load.image('uncommon-card', 'card-uncommon.png');
        this.load.image('rare-card', 'card-rare.png');
        this.load.image('epic-card', 'card-epic.png');
        this.load.image('legendary-card', 'card-legendary.png');
        this.load.image('mithic-card', 'card-mithic.png');


        this.load.image('warrior-0', 'logo.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        //this.scene.start('MainMenu');
        this.scene.start('Game');
    }
}
