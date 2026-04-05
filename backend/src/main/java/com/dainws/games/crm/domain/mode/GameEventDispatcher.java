package com.dainws.games.crm.domain.mode;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.event.Event;

public class GameEventDispatcher {
	private Map<GameMode, GameModeEventDispatcher> modeEventDispatchers;

	public GameEventDispatcher(List<GameModeEventDispatcher> gameModeEventDispatchers) {
		this.modeEventDispatchers = new HashMap<>();
		for (GameModeEventDispatcher dispatcher : gameModeEventDispatchers) {
			this.modeEventDispatchers.put(dispatcher.getGameMode(), dispatcher);
		}
	}

	public void dispatchEvent(Event event) {
		Game game = event.getDetails().getGame();

		if (this.modeEventDispatchers.containsKey(game.getMode())) {
			this.modeEventDispatchers.get(game.getMode()).dispatch(event);
		}
	}
}
