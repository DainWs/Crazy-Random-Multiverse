import eventObserver from "@/application/events/observer";
import gameProvider from "@/application/providers/gameProvider";

const processGameEvent = (gameEvent) => {
	if (gameEvent.details.game) {
		gameProvider.supply(gameEvent.details.game);
	}

    eventObserver.notify(gameEvent.code, gameEvent);
}

const processGameError = (gameError) => {
    eventObserver.notify('ERROR', gameError);
}

export {
    processGameEvent,
    processGameError
}