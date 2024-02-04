package com.dainws.games.crm.persistence.memory;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.GameCode;
import com.dainws.games.crm.domain.GameRepository;
import com.dainws.games.crm.exception.GameNotFoundException;

public class MemoryGameRepository implements GameRepository {
	private Map<GameCode, Game> games;
	private Logger logger;

	public MemoryGameRepository() {
		this.games = new HashMap<>();
		this.logger = LoggerFactory.getLogger(MemoryGameRepository.class.getCanonicalName());
	}

	@Override
	public void save(Game game) {
		this.logger.info("Guardando el juego con codigo {}", game.getCode());
		this.games.put(game.getCode(), game);
	}

	@Override
	public void delete(GameCode gameCode) {
		this.logger.info("Borrando el juego con codigo {}", gameCode);
		this.games.remove(gameCode);
	}

	@Override
	public boolean has(GameCode gameCode) {
		return this.games.containsKey(gameCode);
	}

	@Override
	public Game find(GameCode gameCode) throws GameNotFoundException {
		if (this.has(gameCode)) {
			return this.games.get(gameCode);
		}

		throw new GameNotFoundException();
	}
}
