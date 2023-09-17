package com.dainws.games.crm.console.domain;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.GameCode;
import com.dainws.games.crm.console.domain.models.exceptions.GameAlreadyExistException;
import com.dainws.games.crm.console.domain.models.exceptions.GameNotFoundException;

public interface GameRepository {
	void saveGame(Game game) throws GameAlreadyExistException;

	Game findGame(GameCode gameCode) throws GameNotFoundException;

	boolean hasGame(GameCode gameCode);
}
