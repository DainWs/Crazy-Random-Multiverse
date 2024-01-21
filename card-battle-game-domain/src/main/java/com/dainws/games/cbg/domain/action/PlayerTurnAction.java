package com.dainws.games.cbg.domain.action;

import java.lang.System.Logger;
import java.util.List;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.event.EventCode;
import com.dainws.games.cbg.domain.event.EventHandler;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Player;

public abstract class PlayerTurnAction implements Action {

	protected EventHandler eventHandler;
	protected Logger logger;

	public PlayerTurnAction() {
		this.eventHandler = new EventHandler();
		this.logger = System.getLogger(LOGGER_NAME);
	}
	
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
	
	protected void notifyActionEvent(EventCode eventCode, ActionContext context) {
		List<Player> players = context.getGame().getPlayers();
		this.eventHandler.notifyEventToPlayers(players, new ActionEvent(eventCode, context));
	}

	@Override
	public void setEventHandler(EventHandler eventHandler) {
		this.eventHandler = eventHandler;
	}
}
