import { sendAction, sendPassTurnAction } from "@/api/GameApi";
import ActionPattern from "@/core/actions/ActionPattern";
import ActionResolver from "@/core/actions/ActionResolver";
import CardMovePattern from "@/core/actions/CardMovePattern";
import CardPutPattern from "@/core/actions/CardPutPattern";
import ActionEvent from "@/domain/ActionEvent";
import GameCode from "@/domain/GameCode";
import EventBus from "@/game/EventBus";
import { GameScene } from "@/game/scenes/Game";

class ActionSystem {
    private readonly scene: GameScene;
    private readonly gameCode: GameCode;
    private readonly resolvers: Array<ActionResolver>;
    
    public constructor(scene: GameScene, gameCode: GameCode) {
        this.scene = scene;
        this.gameCode = gameCode;
        this.resolvers = [];
        this.addPattern(new CardPutPattern());
        this.addPattern(new CardMovePattern());

        //EventBus.on('card.grab', this.process, this);
        //EventBus.on('card.drop', this.process, this);
        //EventBus.on('card.left-click', this.process, this);
        //EventBus.on('card.right-click', this.process, this);
    };

    private addPattern(pattern: ActionPattern): void {
        this.resolvers.push(new ActionResolver(pattern));
    }

    private async process(event: ActionEvent): Promise<void> {
        const completedResolvers: Array<ActionResolver> = [];

        for (const resolver of this.resolvers) {
            if (resolver.apply(event) && resolver.isComplete()) {
                completedResolvers.push(resolver);
            }
        }

        if (completedResolvers.length > 0) {
            const resolver = completedResolvers[0];
            const action = resolver.createAction(this.gameCode);
            await sendAction(action);
            this.resetResolvers();
        }
    }
    
    public async passTurn(): Promise<void> {
        this.resetResolvers();
        await sendPassTurnAction(this.gameCode);
    }

    public cancelCurrentAction(): void {
        this.resetResolvers();
    }

    private resetResolvers(): void {
        this.resolvers.forEach(resolver => resolver.reset());
    }
}

export default ActionSystem;