package com.dainws.games.crm.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.GameLifeCycle;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.mode.GameFactory;
import com.dainws.games.crm.domain.mode.GameModeFactory;
import com.dainws.games.crm.domain.repositories.GameRepository;

@Service
public class GameService {

	private Logger logger;

	private GameFactory gameFactory;
	private GameLifeCycle gameLifeCycle;
	private GameRepository gameRepository;

	public GameService(GameLifeCycle gameLifeCycle, GameRepository gameRepository,
			List<GameModeFactory> gameModeFactories) {
		this.logger = LoggerFactory.getLogger(getClass());
		this.gameLifeCycle = gameLifeCycle;
		this.gameRepository = gameRepository;
		this.gameFactory = new GameFactory(gameRepository);

		for (GameModeFactory gameModeFactory : gameModeFactories) {
			this.gameFactory.registre(gameModeFactory);
		}
	}

	public Game loadPartyGame(Party party) {
		this.logger.trace("Creating game for party {}", party.getCode());

		Game game = this.gameFactory.createGame(party);
		party.setCurrentGame(game.getCode());

		this.gameLifeCycle.register(game, this::loadGameForUsers);
		this.gameLifeCycle.startLoading(game);
		return game;
	}

	private boolean loadGameForUsers(Player player) {
		return player instanceof UserPlayer;
	}

	public void loadCompleteFor(GameCode gameCode, PlayerCode playerCode) {
		Game game = this.gameRepository.find(gameCode);
		this.gameLifeCycle.loadCompleteFor(game, playerCode);
	}
	
	@EventListener
	public void updateEventGame(Event event) {
		Game game = event.getDetails().getGame();
		
		if (game.isRunning()) {
			this.gameLifeCycle.updateGameProgress(game);			
		}
	}

	public Game getActiveGame(GameCode gameCode) {
		return this.gameRepository.find(gameCode);
	}

	public void setGameFactory(GameFactory gameFactory) {
		this.gameFactory = gameFactory;
	}
}
