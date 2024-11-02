package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;

public class PassTurnAction extends PlayerTurnAction {
	@Override
	protected boolean performPlayerAction(ActionContext context) throws PlayerActionException {
		if (this.canPassTurn(context)) {
			this.notifyActionEvent(EventCode.PLAYER_PASS_TURN, context);
			return true;
		}

		return false;
	}
	
	private boolean canPassTurn(ActionContext actionContext) {
		Game game = actionContext.getGame();
		return game.countAlivePlayers() > 1; 
	}
}
