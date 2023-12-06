package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.exception.PlayerActionException;

public class PassTurnAction extends PlayerTurnAction {

	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		Game game = context.getGame();
		game.nextTurn();
	}

}
