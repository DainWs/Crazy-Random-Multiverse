package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Player;

public abstract class PlayerTurnAction implements Action {
	
	@Override
	public final void perform(ActionContext context) throws PlayerActionException {
		Game game = context.getGame();
		Player playerWithTurn = game.getPlayerWithTurn();
		Player sourcePlayer = context.getSourcePlayer();

		if (!playerWithTurn.equals(sourcePlayer)) {
			throw new PlayerActionException("ALLOWED_ACTION_ONLY_ON_TURN");
		}

		this.performPlayerAction(context);
	}

	protected abstract void performPlayerAction(ActionContext context) throws PlayerActionException;
}
