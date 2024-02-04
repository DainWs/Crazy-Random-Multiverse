package com.dainws.games.crm.domain;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.GameCode;
import com.dainws.games.crm.exception.GameNotFoundException;

public interface GameRepository {
	void save(Game game);

	void delete(GameCode gameCode);
	
	boolean has(GameCode gameCode);
	
	Game find(GameCode gameCode) throws GameNotFoundException;
}
