package com.dainws.games.crm.domain.mode;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.domain.repositories.GameRepository;

public class GameFactory {
	private GameRepository gameRepository;
	private Map<GameMode, GameModeFactory> gameModeFactories;

	public GameFactory(GameRepository gameRepository) {
		this(gameRepository, List.of());
	}

	public GameFactory(GameRepository gameRepository, List<GameModeFactory> factories) {
		this.gameRepository = gameRepository;
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

		GameModeFactory gameModeFactory = this.gameModeFactories.get(gameMode);
		System.out.println(gameModeFactory.getMode());
		System.out.println(gameModeFactory.getClass());
		Game game = gameModeFactory.createGame(party);
		this.gameRepository.save(game);
		return game;
	}

}
