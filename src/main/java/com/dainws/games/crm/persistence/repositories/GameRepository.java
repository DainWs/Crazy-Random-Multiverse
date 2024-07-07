package com.dainws.games.crm.persistence.repositories;

import com.dainws.games.crm.domain.exception.GameNotFoundException;
import com.dainws.games.crm.domain.models.Game;
import com.dainws.games.crm.domain.models.GameCode;

public interface GameRepository {
	void save(Game game);

	void delete(GameCode gameCode);
	
	boolean has(GameCode gameCode);
	
	Game find(GameCode gameCode) throws GameNotFoundException;
}