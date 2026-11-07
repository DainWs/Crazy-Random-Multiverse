package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.GameExceptionCode;

public class PassTurnAction extends PlayerTurnAction {
	@Override
	protected ActionResult performPlayerAction(ActionContext context) {
		this.logTrace("The player can pass turn?: {}", this.canPassTurn(context));
		if (this.canPassTurn(context)) {
			this.notifyActionEvent(EventCode.PLAYER_PASS_TURN, context);
			return ActionResult.successful();
		}

		return ActionResult.failed(GameExceptionCode.NOT_IN_PROGRESS);
	}

	private boolean canPassTurn(ActionContext actionContext) {
		Game game = actionContext.getGame();
		return game.countAlivePlayers() > 1;
	}
}
