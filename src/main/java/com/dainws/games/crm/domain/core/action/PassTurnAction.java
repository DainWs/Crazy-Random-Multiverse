package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;

public class PassTurnAction extends PlayerTurnAction {
	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		this.notifyActionEvent(EventCode.PLAYER_PASS_TURN, context);
	}
}
