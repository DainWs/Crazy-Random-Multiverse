package com.dainws.games.crm.console.repositories;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.GameCode;
import com.dainws.games.crm.console.domain.GameRepository;
import com.dainws.games.crm.console.domain.models.exceptions.GameAlreadyExistException;
import com.dainws.games.crm.console.domain.models.exceptions.GameNotFoundException;

@Repository
public class MemoryGameRepository implements GameRepository {
	private Map<GameCode, Game> games;
	
	public MemoryGameRepository() {
		this.games = new HashMap<>();
	}
	
	@Override
	public void saveGame(Game game) throws GameAlreadyExistException {
		GameCode gameCode = game.getGameCode();
		
		if (this.hasGame(gameCode)) {
			throw new GameAlreadyExistException(gameCode);
		}
		
		this.games.put(gameCode, game);
	}

	@Override
	public Game findGame(GameCode gameCode) throws GameNotFoundException {
		if (!this.hasGame(gameCode)) {
			throw new GameNotFoundException(gameCode);
		}

		return this.games.get(gameCode);
	}
	
	@Override
	public boolean hasGame(GameCode gameCode) {
		return this.games.containsKey(gameCode);
	}
}
