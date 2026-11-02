package com.dainws.games.crm.persistence.memory;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.domain.repositories.GameRepository;

public class MemoryGameRepository implements GameRepository {
	private Logger logger;

	private Map<GameCode, Game> games;

	public MemoryGameRepository() {
		this.games = new ConcurrentHashMap<>();
		this.logger = LoggerFactory.getLogger(getClass());
	}

	@Override
	public void save(Game game) {
		this.logger.debug("Saving game with code {}", game.getCode());
		this.games.put(game.getCode(), game);
	}

	@Override
	public void delete(GameCode gameCode) {
		this.logger.debug("Deleting game with code {}", gameCode);
		this.games.remove(gameCode);
	}

	@Override
	public boolean exists(GameCode gameCode) {
		return gameCode != null && this.games.containsKey(gameCode);
	}

	@Override
	public Game find(GameCode gameCode) throws NotFoundException {
		Game game = this.games.get(gameCode);
		if (game == null) {
			throw NotFoundException.gameNotFound();
		}

		return game;
	}
}
