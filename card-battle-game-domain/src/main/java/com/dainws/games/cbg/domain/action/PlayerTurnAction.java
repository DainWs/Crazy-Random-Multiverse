package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.communication.GameEventListener;
import com.dainws.games.cbg.domain.communication.PlayerEventListener;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Player;

public abstract class PlayerTurnAction implements Action {
	
	protected GameEventListener gameEventListener;
	protected PlayerEventListener playerEventListener;
	
	@Override
	public final void perform(ActionContext context) throws PlayerActionException {
		Game game = context.getGame();
		Player playerWithTurn = game.getPlayerWithTurn();
		Player sourcePlayer = context.getSourcePlayer();

		if (!playerWithTurn.equals(sourcePlayer)) {
			throw new PlayerActionException(sourcePlayer, "EXCEPTION_ALLOWED_ACTION_ONLY_ON_TURN");
		}

		this.performPlayerAction(context);
	}

	protected abstract void performPlayerAction(ActionContext context) throws PlayerActionException;
	
	@Override
	public void setGameEventListener(GameEventListener gameEventListener) {
		this.gameEventListener = gameEventListener;
	}
	
	@Override
	public void setPlayerEventListener(PlayerEventListener playerEventListener) {
		this.playerEventListener = playerEventListener;
	}
}
