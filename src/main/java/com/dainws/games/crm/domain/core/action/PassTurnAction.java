package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;

public class PassTurnAction extends PlayerTurnAction {
	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		Game game = context.getGame();
		if (game.getAlivePlayers().size() > 1) {
			this.notifyActionEvent(EventCode.PLAYER_PASS_TURN, context);
		}
	}
}
