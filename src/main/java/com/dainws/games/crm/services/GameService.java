package com.dainws.games.crm.services;

import java.lang.System.Logger;
import java.lang.System.Logger.Level;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.GameLifeCycle;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.mode.GameFactory;
import com.dainws.games.crm.domain.repositories.GameRepository;

public class GameService {

	private Logger logger;

	private GameFactory gameFactory;
	private GameLifeCycle gameLifeCycle;
	private GameRepository gameRepository;

	public GameService(GameFactory gameFactory, GameLifeCycle gameLifeCycle, GameRepository gameRepository) {
		this.logger = System.getLogger("GameService");
		this.gameFactory = gameFactory;
		this.gameLifeCycle = gameLifeCycle;
		this.gameRepository = gameRepository;
	}

	public void loadPartyGame(Party party) {
		this.logger.log(Level.DEBUG, "Creating game for party %s", party.getCode());
		Game game = this.gameFactory.createGame(party);
		party.setCurrentGame(game.getCode());

		this.gameLifeCycle.register(game, this::loadGameForUsers);
		this.gameLifeCycle.startLoading(game);
	}

	private boolean loadGameForUsers(Player player) {
		return player instanceof UserPlayer;
	}

	public Game getActiveGame(GameCode gameCode) {
		return this.gameRepository.find(gameCode);
	}
}
