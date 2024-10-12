package com.dainws.games.crm.domain.mode;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.exception.NotFoundException;

public class GameFactory {
	private Map<GameMode, GameModeFactory> gameModeFactories;

	public GameFactory() {
		this(List.of());
	}

	public GameFactory(List<GameModeFactory> factories) {
		this.gameModeFactories = new HashMap<>();

		for (GameModeFactory gameModeFactory : factories) {
			this.registre(gameModeFactory);
		}
	}

	public void registre(GameModeFactory gameModeFactory) {
		if (gameModeFactory != null) {
			this.gameModeFactories.put(gameModeFactory.getMode(), gameModeFactory);
		}
	}

	public Game createGame(Party party) {
		GameMode gameMode = party.getGameMode();

		if (!this.gameModeFactories.containsKey(gameMode)) {
			throw new NotFoundException("game_mode");
		}

		return this.gameModeFactories.get(gameMode).createGame(party);
	}

}
