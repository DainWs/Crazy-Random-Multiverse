package com.dainws.games.cbg.domain;

import com.dainws.games.cbg.domain.exception.GameNotFoundException;

public interface GameRepository {
	void save(Game game);

	void delete(GameCode gameCode);
	
	boolean has(GameCode gameCode);
	
	Game find(GameCode gameCode) throws GameNotFoundException;
}
